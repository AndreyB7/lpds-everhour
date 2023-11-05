import db from "../db/db";
import collections from '../db/collections';
import { EverhourData } from "../types/types";

export const setEverhourData = async (data: EverhourData) => {
    const everhourDb = db.collection(collections.everhour.name);
    const everhourLog = db.collection(collections.log.name);
    
    await everhourDb.doc(collections.everhour.docs.timeSchema).set({schema: data.time.schema});
    await everhourDb.doc(collections.everhour.docs.tasksSchema).set({schema: data.tasks.schema});

    const everhourTime = everhourDb.doc(collections.everhour.docs.time);
    const everhourTasks = everhourDb.doc(collections.everhour.docs.tasks);

    const today = new Date();
    try {
        await everhourTime.set({data: JSON.stringify(data.time.data)});
        await everhourTasks.set({data: JSON.stringify(data.tasks.data)});
    } catch(e) {
        everhourLog.doc(collections.log.docs.error).set({[today.getTime()]: JSON.stringify(e)})
    }
    
    await everhourLog.doc('update').set({[today.getTime()]: today.toISOString()}, {merge: true});
}

export const getTimeSchema = async () => {
    const everhourDb = db.collection(collections.everhour.name);
    return await everhourDb.doc(collections.everhour.docs.timeSchema).get();
}

export const getTasksSchema = async () => {
    const everhourDb = db.collection(collections.everhour.name);
    return await everhourDb.doc(collections.everhour.docs.tasksSchema).get();
}