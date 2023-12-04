import db from "../db/db";
import collections from '../db/collections';
import { EverhourData } from "../types/types";

export const setEverhourData = async (key: string, data: EverhourData) => {
  const everhourDb = db.collection(collections.everhour.name);
  const everhourLog = db.collection(collections.log.name);

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

export const getTimeSchema = async () => {
  const everhourDb = db.collection(collections.everhour.name);
  return await everhourDb.doc(collections.everhour.docs.timeSchema).get();
}

export const getTasksSchema = async () => {
  const everhourDb = db.collection(collections.everhour.name);
  return await everhourDb.doc(collections.everhour.docs.tasksSchema).get();
}

export const getTasks = async () => {
  const everhourDb = db.collection(collections.everhour.name);
  return await everhourDb.doc(collections.everhour.docs.tasks).get();
}

export const getTime = async () => {
  const everhourDb = db.collection(collections.everhour.name);
  return await everhourDb.doc(collections.everhour.docs.time).get();
}