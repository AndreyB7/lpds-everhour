import { paramsDb } from "./db";
import { tProject } from "../types/types";

let projectParameters: tProject[] | null = null;

export const setProjectParams = async (projectName: string, params: tProject) => {
  await paramsDb.doc(projectName).set(params)
  projectParameters = null // reset cashed parameters
}

export const getProjectsParams = async (): Promise<tProject[]> => {
  if (projectParameters) {
    return projectParameters;
  }
  const snapshot = await paramsDb.get()
  const projectsParams: tProject[] = [];
  snapshot.forEach(doc => {
    const data = doc.data() as tProject;
    if (data.shortName) {
      projectsParams.push(data);
    }
  })
  return projectsParams;
}