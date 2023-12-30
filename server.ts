import 'dotenv/config'
import express from "express";
import { getEHData, getProjectLastUpdate, getTasksSchema, getTimeSchema } from "./db/everhourDB";
import { scheduleTask } from "./services/cronService";
import { everhourDataRefresh } from "./services/refreshService";
import { getTimeString } from "./helpers/time";
import {
  getProjectsParams,
  setProjectParams
} from "./db/parametersDB";
import { runMonitoring, scheduledMonitoring } from "./services/monitoringService";
import { EverhourTasks, EverhourTime, EverhourTimeByTask, tProject } from "./types/types";
import { buildTree, convertDataToObject, createTaskTimeDict } from "./services/projectService";

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.get("/api/refresh", async (req, res) => {
  everhourDataRefresh()
    .then(() => res.send({ status: `refresh run ok: ${ new Date().toString() }` }))
    .catch((e) => {
        res.send({ error: 'Refresh error', message: e.message });
      }
    );
})

// API
app.get('/api/parameters', async (req, res) => {
  const projectsParams = await getProjectsParams();
  // convert seconds to hours
  const result = projectsParams.map(project => (
    { ...project, fullLimit: +project.fullLimit / 3600 }
  ))
  res.send(result);
})

app.post('/api/parameters', async (req, res) => {
  const paramsToUpdate: tProject = {
    shortName: req.body.shortName,
    everhourId: req.body.everhourId,
    fullLimit: req.body.fullLimit * 3600,
    emailNotify: req.body.emailNotify,
    slackChatWebHook: req.body.slackChatWebHook,
  }

  try {
    await setProjectParams(paramsToUpdate.shortName, paramsToUpdate)
    res.send(paramsToUpdate)
  } catch (e) {
    console.log(e)
    res.status(501).send('Error')
  }
})

app.get("/api/monitoring", async (req, res) => {
  await runMonitoring()
  res.send({ status: `monitoring run ok: ${ new Date().toString() }` })
})

app.get("/api/project/:slug", async (req, res) => {
  try {
    // const projectsParams = await getProjectsParams();
    const projectShortName = req.params.slug.toUpperCase()
    const currentMonth = `${ new Date().getFullYear() }-${ new Date().getMonth() + 1 }`

    const timeSchema = await getTimeSchema()
    const tasksSchema = await getTasksSchema()
    const projectData = await getEHData(projectShortName)
    if (!projectData || !projectData.tasks) {
      res.status(400).send({ error: 'not found projectData' })
      return
    }
    const taskDataRaw: string[] = JSON.parse(projectData.tasks[currentMonth])
    const taskData = convertDataToObject<EverhourTasks>(taskDataRaw, tasksSchema)
    const timeDataRaw = JSON.parse(projectData.time[currentMonth])
    const timeData = createTaskTimeDict<EverhourTimeByTask>(timeDataRaw, timeSchema)
    let timeTotal = 0
    Object.values(timeData).forEach((taskTimes) => taskTimes.forEach(task => timeTotal += task.time))
    res.send({
      lastUpdate: await getProjectLastUpdate(projectShortName),
      timeTotal: timeTotal > 0 ? getTimeString(timeTotal) : 'ND',
      tasks: buildTree(taskData, timeData),
      time: timeData
    })
  } catch (e) {
    console.log(e)
  }
});

// scheduled tasks
scheduleTask('17 13 * * 1-5', scheduledMonitoring)

app.listen(1337, () => {
  console.log("Server listening on port 1337")
})
