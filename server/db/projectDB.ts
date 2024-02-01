import { projectDb } from "./db";
import { Project } from "../../types/types";
import { setProjectParams } from "./parametersDB";

export const getProjects = async (): Promise<Project[]> => {
  const snapshot = await projectDb.get()
  return snapshot.docs.map(doc => doc.data()) as Project[]
}

export const createProject = async (data:Project) => {
  await projectDb.doc(data.slug).create(data);
  await setProjectParams(data.shortName.toUpperCase(), {
    emailNotify: '',
    shortName: data.shortName,
    fullLimit: 0,
    everhourId: '',
    slackChatWebHook: '',
  })
}