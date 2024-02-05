import "dotenv/config"
import express from "express";
import { scheduleTask } from "./services/cronService";
import { everhourDataRefresh } from "./services/refreshService";
import {
  getProjectsParams,
  setProjectParams
} from "./db/parametersDB";
import { runMonitoring, scheduledMonitoring, sendMonitoringInfo } from "./services/monitoringService";
import { TeamMember, tProject } from "../types/types";
import { getProjectData } from "./services/projectService";
import { getLastMonitoring } from "./db/logsDB";
import everhourConfig from "./tokens/everhour-api";
import { createProject, deleteProject, getProject, getProjects, setProject } from "./db/projectDB";
import { getPage, setPage } from "./db/pageDB";

const app = express();
app.use(express.json());

app.get("/api/team", async (req, res) => {
  try {
    const data = await fetch(
      'https://api-ro.everhour.com/team/users', {
        headers: { "X-Api-Key": everhourConfig.key ? everhourConfig.key : '' }
      });
    const team = (await data.json()).filter((tm: TeamMember) => tm.status !== 'removed' && tm.type == 'contractor')
    res.send(team)
  } catch (e: any) {
    res.send({ error: 'Error', message: e.message });
  }
})

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

// All Projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await getProjects()
    res.send(projects)
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: JSON.stringify(e) })
  }
});

// Get Projects options
app.get("/api/project/:slug/options", async (req, res) => {
  try {
    const project = await getProject(req.params.slug)
    res.send(project)
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: JSON.stringify(e) })
  }
});

// Update Projects options
app.post("/api/project/:slug/options", async (req, res) => {
  const data = req.body
  try {
    await setProject(data)
    res.send({message: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: JSON.stringify(e) })
  }
});

// Create Project
app.post("/api/add-project", async (req, res) => {
  const data = req.body
  try {
    await createProject(data)
    res.send({message: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: JSON.stringify(e) })
  }
});

// Delete Project
app.delete("/api/project/:slug/delete", async (req, res) => {
  try {
    await deleteProject(req.params.slug)
    res.send({message: 'ok'})
  } catch (e) {
    console.log(`add-project error: ${JSON.stringify(e)}`)
    res.status(400).send({ error: JSON.stringify(e) })
  }
});

// Page
app.get("/api/page/:slug", async (req, res) => {
  try {
    const project = await getPage(req.params.slug)
    res.send(project ?? { error: 'Not found'})
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: JSON.stringify(e) })
  }
});

app.post("/api/page/:slug", async (req, res) => {
  const data = req.body
  try {
    await setPage(req.params.slug, data)
    res.send({message: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: JSON.stringify(e) })
  }
});


// scheduled tasks
scheduleTask('17 13 * * 1-5', scheduledMonitoring)

app.listen(1337, () => {
  console.log("Server listening on port 1337")
})
