import express from "express";
import { getEverhourAPIData } from "./services/everhourAPIServce";
import { getTasksSchema, getTimeSchema, setEverhourData } from "./services/everhourDBService";

const app = express();

app.set("view engine", "ejs")
app.use("/assets", express.static("assets"))

app.get("/", async (req, res, next) => {
    const timeSchema = await getTimeSchema();
    const tasksSchema = await getTasksSchema();
    res.render('home', {
        schemaTime: JSON.stringify( timeSchema.data()?.schema, null, 2),
        schemaTasks: JSON.stringify( tasksSchema.data()?.schema, null, 2),
        dataTime: '',
        dataTasks: ''
     })
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

app.listen(1337, () => { console.log("Listening on port 1337") })
