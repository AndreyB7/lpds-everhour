import db from "../db/db";
import collections from '../db/collections';
import { EverhourData } from "../types/types";

const everhourLog = db.collection(collections.log.name);
const everhourDb = db.collection(collections.everhour.name);
export const setEverhourData = async (key: string, data: EverhourData) => {

  await everhourDb.doc(collections.everhour.docs.timeSchema).set({ schema: data.time.schema });
  await everhourDb.doc(collections.everhour.docs.tasksSchema).set({ schema: data.tasks.schema });

  const everhourTime = everhourDb.doc(collections.everhour.docs.time);
  const everhourTasks = everhourDb.doc(collections.everhour.docs.tasks);

  const today = new Date();
  try {
    await everhourTime.set({ [key]: JSON.stringify(data.time.data) }, { merge: true });
    await everhourTasks.set({ [key]: JSON.stringify(data.tasks.data) }, { merge: true });
  } catch (e: any) {
    await everhourLog.doc(collections.log.docs.error).set({ [today.toISOString()]: e.message }, { merge: true })
  }

  await everhourLog.doc('update').set({ [today.toISOString()]: 'updated' }, { merge: true });
}

export const setProjectEverhourData = async (projectShortName:string, key: string, data: EverhourData) => {

  const projectEverhour = everhourDb.doc(projectShortName);

  const today = new Date();
  try {
    await projectEverhour.set(
      {
        time: { [key]: JSON.stringify(data.time.data) },
        tasks: { [key]: JSON.stringify(data.tasks.data) },
      }, { merge: true }
    )
  } catch (e: any) {
    await everhourLog.doc(collections.log.docs.error).set({ [today.toISOString()]: e.message }, { merge: true })
  }

  await everhourLog.doc('update').set({ [today.toISOString()]: 'updated' }, { merge: true });
}

export const getTimeSchema = async () => {
  return await everhourDb.doc(collections.everhour.docs.timeSchema).get();
}

export const getTasksSchema = async () => {
  return await everhourDb.doc(collections.everhour.docs.tasksSchema).get();
}

export const getEHData = async (projectShortName: string) => {
  return await everhourDb.doc(projectShortName).get();
}
