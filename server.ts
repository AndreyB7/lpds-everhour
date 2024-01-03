import "dotenv/config"
import express from "express";
import { scheduleTask } from "./services/cronService";
import { everhourDataRefresh } from "./services/refreshService";
import {
  getProjectsParams,
  setProjectParams
} from "./db/parametersDB";
import { runMonitoring, scheduledMonitoring, sendMonitoringInfo } from "./services/monitoringService";
import { tProject } from "./types/types";
import { getProjectData } from "./services/projectService";
import { getLastMonitoring } from "./db/logsDB";

const app = express();
app.use(express.json());

// routes
app.get("/api/refresh", async (req, res) => {
  try {
    await everhourDataRefresh()
    const m = await runMonitoring()
    await sendMonitoringInfo(m)
    res.send({ status: `refresh run ok: ${ new Date().toString() }` })
  } catch (e: any) {
    res.send({ error: 'Refresh error', message: e.message });
  }
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
    res.status(501).send({ error: 'Save project parameters error' })
  }
})

app.get("/api/monitoring", async (req, res) => {
  await runMonitoring()
  res.send({ status: `monitoring run ok: ${ new Date().toString() }` })
})

app.get("/api/monitoring/data", async (req, res) => {
  res.send(await getLastMonitoring())
})

app.get("/api/project/:slug", async (req, res) => {
  try {
    const projectShortName = req.params.slug.toUpperCase()
    res.send(await getProjectData(projectShortName))
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: 'Get project data error' })
  }
});

// scheduled tasks
scheduleTask('17 13 * * 1-5', scheduledMonitoring)

app.listen(1337, () => {
  console.log("Server listening on port 1337")
})
