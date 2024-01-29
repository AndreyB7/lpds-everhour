import { projectDb } from "./db";
import { Project } from "../types/types";
import { v4 as uuidv4 } from 'uuid';

export const getProjects = async (): Promise<Project[]> => {
  const snapshot = await projectDb.get()
  return snapshot.docs.map(doc => doc.data()) as Project[]
}

export const setProject = async (data:Project) => {
  if (!data.id) {
    data.id = uuidv4();
  }
  await projectDb.doc(data.id).set(data);
}