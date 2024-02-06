import { everhourDb, logsDb } from "./db";
import collections from '../db/collections';
import { EverhourData, EverhourProjectData } from "../../types/types";
import { setProjectLastUpdate } from "./logsDB";

// setters
export const setProjectEverhourData = async (projectSlug: string, key: string, data: EverhourData) => {

  const today = new Date();
  try {
    await everhourDb.doc(projectSlug).set(
      {
        time: { [key]: JSON.stringify(data.time.data) },
        tasks: { [key]: JSON.stringify(data.tasks.data) },
      }, { merge: true }
    )
    setProjectLastUpdate(projectSlug)
  } catch (e: any) {
    await logsDb.doc(collections.log.docs.error).set({ [today.toISOString()]: e.message }, { merge: true })
  }
}

// getters
export const getTimeSchema = async () => {
  return (await everhourDb.doc(collections.everhour.docs.timeSchema).get()).data()?.schema as string[];
}

export const getTasksSchema = async () => {
  return (await everhourDb.doc(collections.everhour.docs.tasksSchema).get()).data()?.schema as string[];
}

export const getProjectEverhourData = async (projectSlug: string) => {
  const data = await everhourDb.doc(projectSlug).get()
  if (!data.exists) {
    throw Error('No such EH document!')
  }
  return data.data() as EverhourProjectData;
}
