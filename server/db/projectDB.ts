import { projectDb } from "./db";
import { initProject, Project } from "../../types/types";

let projectsCache: {[key: string]: Project} = {};
export const getProjects = async (): Promise<Project[]> => {
  const snapshot = await projectDb.get()
  return snapshot.docs.map(doc => doc.data()) as Project[]
}

export const createProject = async (data:initProject) => {
  data.id = new Date().getTime().toString();
  const defaultParams = {
    emailNotify: '',
    fullLimit: 0,
    everhourId: '',
    slackChatWebHook: '',
  }
  data = {
    ...defaultParams,
    ...data
  }
  await projectDb.doc(data.slug).create(data)
}

export const getProject = async (slug:string):Promise<Project> => {
  if (projectsCache[slug]) {
    return projectsCache[slug]
  }
  const project = (await projectDb.doc(slug).get()).data() as Project
  projectsCache[slug] = project
  return project
}

export const setProject = async (data:Project) => {
  await projectDb.doc(data.slug).set(data)
  delete projectsCache[data.slug]
}

export const deleteProject = async (slug:string) => {
  await projectDb.doc(slug).delete()
  delete projectsCache[slug]
}
