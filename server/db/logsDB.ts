import { tMonitoring } from "../../types/types";
import { logsDb } from "./db";
import collections from "./collections";
import { firestore } from "firebase-admin";
import DocumentSnapshot = firestore.DocumentSnapshot;

export const setLastMonitoring = async (data: tMonitoring[]) => {
  const toPlainObject = {...data}
  await logsDb.doc(collections.log.docs.lastMonitoring).set(toPlainObject);
}

export const getLastMonitoring = async () => {
  const snapshot: DocumentSnapshot<{[key:string]:tMonitoring}> = await logsDb.doc(collections.log.docs.lastMonitoring).get()
  if (snapshot.exists) {
    const monitoring = snapshot.data()
    return monitoring ? Object.values(monitoring) : []
  }
  return []
}

type tLastUpdate = {project: string, time: number, timeString: string}

export const setProjectLastUpdate = async (projectShortName: string) => {
  const today = new Date()
  await logsDb.doc(`${ projectShortName }-lastUpdate`).set({
    project: projectShortName,
    time: today.getTime(),
    timeString: today.toISOString()
  });
}
export const getProjectLastUpdate = async (projectShortName: string) => {
  const snapshot = await logsDb.doc(`${projectShortName}-lastUpdate`).get()
  return snapshot.data() as tLastUpdate;
}