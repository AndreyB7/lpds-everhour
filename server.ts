import express from "express";
import { getTasks, getTasksSchema, getTime, getTimeSchema } from "./services/everhourDBService";
import { scheduleTask } from "./services/cronService";
import { everhourDataRefresh } from "./services/refreshService";
import secret from './tokens/secret'
import cookieSession from 'cookie-session';
import { getTimeString } from "./helpers/time";
import { getParametersData, setParametersData } from "./services/parametersDBService";
import { isLoggedIn } from "./auth/auth";
import { runMonitoring } from "./services/monitoringService";
import { tParameters } from "./types/types";

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
    const timeSchema = await getTimeSchema();
    const tasksSchema = await getTasksSchema();
    const tasks = await getTasks();
    const time = await getTime();
    const currentMonth = `${ new Date().getFullYear() }-${ new Date().getMonth() + 1 }`;
    const taskData = JSON.parse(tasks.data()?.[currentMonth]);
    const timeData = JSON.parse(time.data()?.[currentMonth]);
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
  const params = await getParametersData();
  params.fullLimitString = getTimeString(params.fullLimit);
  res.render('params', {params});
})

app.post('/params', isLoggedIn, async (req, res) => {
  const params = await getParametersData();
  const paramsToUpdate: tParameters = {
    fullLimit: req.body.fullLimit ? req.body.fullLimit * 3600 : params.fullLimit,
    emailNotify: req.body.emailNotify.length ? req.body.emailNotify : params.emailNotify,
  }
  await setParametersData({...params, ...paramsToUpdate});
  res.redirect('/params')
})

app.get("/refresh", isLoggedIn, async (req, res) => {
  await everhourDataRefresh();
  res.redirect('/');
})

// scheduled tasks
scheduleTask('1 13 * * *', everhourDataRefresh);
scheduleTask('7 13 * * *', runMonitoring);

app.listen(1337, () => {
  console.log("Listening on port 1337")
})
