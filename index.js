import express from "express"
import got from 'got'
//Middleware to parse data in body portion of incoming request, like POST //request
import { createRequire } from "module"
const require = createRequire(import.meta.url)

const body_parser = require("body-parser")
const objForUrlencoded = body_parser.urlencoded({ extended: false })

// Everhour API
const { key: everhourApiKey, url: everhourApiUrl } = require('./tokens/everhour-api.json')

const body = {
    period: ["2023-11-01", "2023-11-30"],
    users: null,
    projects: ['as:1198224364498799'],
    filters: [],
    propagateSubtasks: false,
    propagateSubtasksTotals: false,
    tasksWithEstimate: false,
    loadParentTasks: true
};

const options = {
	headers: {
		'X-Api-Key': everhourApiKey,
	},
	json: body
};

//Firestore DB
const fs = require('firebase-admin');

const serviceAccount = require('./tokens/lpds-everhour-7c35ec277385.json');

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();
//

const everhourDb = db.collection('everhour');

const everhourLog = db.collection('log');

const setEverhourData = async () => {
    const res = await got.post(everhourApiUrl, options);

    const data = JSON.parse(res.body);

    await everhourDb.doc('timeSchema').set({schema: data.time.schema});

    await everhourDb.doc('tasksSchema').set({schema: data.tasks.schema});

    const everhourTime = everhourDb.doc('time');
    const everhourTasks = everhourDb.doc('tasks');

    const today = new Date();
    try {
        await everhourTime.set({data: JSON.stringify(data.time.data)});
        await everhourTasks.set({data: JSON.stringify(data.tasks.data)});
    } catch(e) {
        console.log(e);
        everhourLog.doc('error').set({[today.getTime()]: 'db set data error'})
    }
    
    await everhourLog.doc('update').set({[today.getTime()]: today.toISOString()}, {merge: true});
}
//

const app = express();

app.set("view engine", "ejs")
app.use("/assets", express.static("assets"))
app.use(objForUrlencoded)

app.get("/", async (req, res, next) => {
    const timeSchema = await everhourDb.doc('timeSchema').get();
    const tasksSchema = await everhourDb.doc('tasksSchema').get();
    res.render('home', {
        schemaTime: JSON.stringify( timeSchema.data().schema, null, 2),
        schemaTasks: JSON.stringify( tasksSchema.data().schema, null, 2),
        dataTime: '',
        dataTasks: ''
     })
})
app.get("/refresh", (req, res, next) => {
    try {
        setEverhourData();
    } catch(e) {
        console.log(e);
        res.render("set", {info: e})
    }
    res.render("set", {info: 'Updated'})
})

app.listen(1337, () => { console.log("Listening on port 1337") })
