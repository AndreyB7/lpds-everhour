import db from "../db/db";
import collections from '../db/collections';
import { EverhourData, EverhourProjectData } from "../types/types";

const logsDb = db.collection(collections.log.name);
const everhourDb = db.collection(collections.everhour.name);

// setters
export const setProjectEverhourData = async (projectShortName: string, key: string, data: EverhourData) => {

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
    await logsDb.doc(collections.log.docs.error).set({ [today.toISOString()]: e.message }, { merge: true })
  }

  await logsDb.doc(`${ projectShortName }-lastUpdate`).set({
    project: projectShortName,
    time: today.getTime(),
    timeString: today.toISOString()
  });
}

// getters
export const getTimeSchema = async () => {
  return (await everhourDb.doc(collections.everhour.docs.timeSchema).get()).data()?.schema as string[];
}

export const getTasksSchema = async () => {
  return (await everhourDb.doc(collections.everhour.docs.tasksSchema).get()).data()?.schema as string[];
}

export const getEHData = async (projectShortName: string) => {
  return (await everhourDb.doc(projectShortName).get()).data() as EverhourProjectData;
}

export const getProjectLastUpdate = async (projectShortName: string) => {
  return (await logsDb.doc(`${projectShortName}-lastUpdate`).get()).data() as {time: number};
}
