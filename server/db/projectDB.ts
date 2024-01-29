import { projectDb } from "./db";
import { Project } from "../../types/types";

export const getProjects = async (): Promise<Project[]> => {
  const snapshot = await projectDb.get()
  return snapshot.docs.map(doc => doc.data()) as Project[]
}

export const createProject = async (data:Project) => {
  await projectDb.doc(data.slug).create(data);
}