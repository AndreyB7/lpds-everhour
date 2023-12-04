import db from "../db/db";
import collections from "../db/collections";
import { tParameters } from "../types/types";

export const setParametersData = async (params: tParameters) => {
  const paramsDb = db.collection(collections.parameters.name);
  await paramsDb.doc(collections.parameters.docs.projectParams).set(params);
}

export const getParametersData = async () => {
  const paramsDb = db.collection(collections.parameters.name);
  return (await paramsDb.doc(collections.parameters.docs.projectParams).get()).data() as tParameters || {};
}