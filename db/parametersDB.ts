import db from "../db/db";
import collections from "../db/collections";
import { tParameters, tProject } from "../types/types";

let parameters: tParameters | null = null;
let projectParameters: {[key:string]: tProject } | null = null;
const paramsDb = db.collection(collections.parameters.name)

export const setParametersData = async (params: tParameters) => {
  await paramsDb.doc(collections.parameters.docs.params).set(params);
  parameters = null // reset cashed parameters
}

export const getParametersData = async (): Promise<tParameters> => {
  if (!parameters) {
    parameters = (await paramsDb.doc(collections.parameters.docs.params).get()).data() as tParameters
  }
  return parameters
}

export const setProjectParams = async (projectName: string, params: tProject) => {
  await paramsDb.doc(projectName).set(params)
  projectParameters = null // reset cashed parameters
}

export const getProjectsParams = async () => {
  if (projectParameters) {
    return projectParameters;
  }
  const snapshot = await paramsDb.get()
  const projectsParams: {[key:string]: tProject } = {};
  snapshot.forEach(doc => {
    const data = doc.data() as tProject;
    if (data.shortName) {
      projectsParams[data.shortName] = data;
    }
  })
  return projectsParams;
}