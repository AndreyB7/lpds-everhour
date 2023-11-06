import express from "express";
import { getEverhourAPIData } from "./services/everhourAPIServce";
import { getTasks, getTasksSchema, getTimeSchema, setEverhourData } from "./services/everhourDBService";
import { sendMail } from "./services/mailerService";
import { scheduleTask } from "./services/cronService";

const app = express();

app.set("view engine", "ejs")

// routes
app.get("/", async (req, res, next) => {
    try {
    const timeSchema = await getTimeSchema();
    const tasksSchema = await getTasksSchema();
    const tasks = await getTasks();
    res.render('home', {
        schemaTime: JSON.stringify( timeSchema.data()?.schema, null, 2),
        schemaTasks: JSON.stringify( tasksSchema.data()?.schema, null, 2),
        tasks: JSON.parse( tasks.data()?.data),
        dataTime: '',
        dataTasks: ''
     })
    } catch(e) {

    }
})
app.get("/refresh", async (req, res, next) => {
    
    const EHRequestParams = {
        period: ["2023-11-01", "2023-11-30"],
        users: null,
        projects: ['as:1198224364498799'],
        filters: [],
        propagateSubtasks: false,
        propagateSubtasksTotals: false,
        tasksWithEstimate: false,
        loadParentTasks: true
    };

    try {
        const data = await getEverhourAPIData(EHRequestParams);
        await setEverhourData(data);
        res.render("set", {info: 'Updated'})
    } catch(e) {
        res.render("set", {info: e})
    }
})

app.get("/send", (req, res, next) => {
    sendMail();
    res.send('ok');
})

// scheduled tasks
scheduleTask('44 * * * * ', sendMail);

app.listen(1337, () => { console.log("Listening on port 1337") })
