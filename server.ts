import 'dotenv/config'
import express from "express";
import { getEHData, getTasksSchema, getTimeSchema } from "./db/everhourDB";
import { scheduleTask } from "./services/cronService";
import { everhourDataRefresh } from "./services/refreshService";
import { getTimeString } from "./helpers/time";
import {
  getProjectsParams,
  setProjectParams
} from "./db/parametersDB";
import { runMonitoring, scheduledMonitoring } from "./services/monitoringService";
import { tProject } from "./types/types";

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.get("/api/refresh", async (req, res) => {
  everhourDataRefresh()
    .then(() => res.send({status: 'ok'}))
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

app.post('/api/parameters',async (req, res) => {
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

app.get("/api/:slug", async (req, res) => {
  try {
    // const projectsParams = await getProjectsParams();
    const currentMonth = `${ new Date().getFullYear() }-${ new Date().getMonth() + 1 }`

    const timeSchema = await getTimeSchema()
    const tasksSchema = await getTasksSchema()
    const projectData = await getEHData(req.params.slug.toUpperCase())
    if (!projectData || !projectData.tasks) {
      res.status(400).send({error: 'not found projectData'})
    }
    const taskData = JSON.parse(projectData.tasks[currentMonth])
    const timeData = JSON.parse(projectData.time[currentMonth])
    let timeTotal = 0
    if (timeData) {
      timeData.forEach((task: any) => timeTotal += task[4])
    }
    res.send({
      schemaTime: timeSchema.data()?.schema ?? [],
      schemaTasks: tasksSchema.data()?.schema ?? [],
      timeTotal: timeTotal > 0 ? getTimeString(timeTotal) : 'ND',
      tasks: taskData,
    })
  } catch (e) {
    console.log(e)
  }
});

app.get("/api/monitoring", async (req, res) => {
  await runMonitoring()
  res.send(`run ${new Date().toString()}`)
})

// scheduled tasks
scheduleTask('17 13 * * 1-5', scheduledMonitoring)

app.listen(1337, () => {
  console.log("Server listening on port 1337")
})
