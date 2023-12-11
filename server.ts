import express from "express";
import { getEHData, getTasksSchema, getTimeSchema } from "./db/everhourDB";
import { scheduleTask } from "./services/cronService";
import { everhourDataRefresh } from "./services/refreshService";
import secret from './tokens/secret'
import cookieSession from 'cookie-session';
import { getTimeString } from "./helpers/time";
import {
  getProjectsParams,
  setProjectParams
} from "./db/parametersDB";
import { isLoggedIn } from "./auth/auth";
import { runMonitoring } from "./services/monitoringService";
import { tProject } from "./types/types";

const app = express();

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }));

app.use(cookieSession({
  name: 'session',
  keys: ['secretKey'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// routes
app.get("/", isLoggedIn, async (req, res) => {
  try {
    // const projectsParams = await getProjectsParams();
    const timeSchema = await getTimeSchema();
    const tasksSchema = await getTasksSchema();
    const projectData = (await getEHData('SVT')).data()
    const currentMonth = `${ new Date().getFullYear() }-${ new Date().getMonth() + 1 }`;
    const taskData = JSON.parse(projectData?.tasks[currentMonth]);
    const timeData = JSON.parse(projectData?.time[currentMonth]);
    let timeTotal = 0;
    if (timeData) {
      timeData.forEach((task: any) => timeTotal += task[4]);
    }
    res.render('home', {
      schemaTime: JSON.stringify(timeSchema.data()?.schema, null, 2),
      schemaTasks: tasksSchema.data()?.schema ?? [],
      tasks: taskData,
      timeTotal: timeTotal > 0 ? getTimeString(timeTotal) : 'ND',
      dataTime: '',
      dataTasks: ''
    })
  } catch (e) {
    console.log(e)
  }
});

app.get("/login", async (req, res) => {
  res.render('login')
});

app.post("/login", async (req, res) => {
  if (req.body?.login === secret.token) {
    if (req.session) {
      req.session.login = true;
    }
    res.redirect('/')
    return
  }
  res.redirect('/login')
});

app.get("/logout", isLoggedIn, async (req, res) => {
  req.session = null
  res.redirect('/')
});

app.get('/params', isLoggedIn, async (req, res) => {
  const projectsParams = await getProjectsParams();
  // convert seconds to hours
  Object.keys(projectsParams).forEach(key => {
    projectsParams[key] = { ...projectsParams[key], fullLimit: projectsParams[key].fullLimit / 3600 }
  })
  res.render('params', { data: projectsParams });
})

app.post('/params', isLoggedIn, async (req, res) => {
  const paramsToUpdate: tProject = {
    shortName: req.body.shortName,
    everhourId: req.body.everhourId,
    fullLimit: req.body.fullLimit * 3600,
    emailNotify: req.body.emailNotify,
    slackChatWebHook: req.body.slackChatWebHook,
  }
  try {
    await setProjectParams(paramsToUpdate.shortName, paramsToUpdate);
  } catch (e) {
    console.log(e);
  }
  res.redirect('/params')
})

app.get("/refresh", isLoggedIn, async (req, res) => {
  everhourDataRefresh()
    .then(() => res.redirect('/'))
    .catch((e) => {
        res.render('error', { message: e.message });
      }
    );
})

// scheduled tasks
if (process.env.NODE_ENV !== 'dev') {
  scheduleTask('11 14 * * 1-5', everhourDataRefresh)
  scheduleTask('17 14 * * 1-5', runMonitoring)
}

app.listen(1337, () => {
  console.log("Listening on port 1337")
})
