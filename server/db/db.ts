//Firestore DB
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../tokens/firestore'
import collections from "./collections";

const firebaseApp = initializeApp({
    credential: cert(serviceAccount),
})

const db = getFirestore(firebaseApp, process.env.NODE_ENV == 'development' ? 'lpds-dev' : '(default)')
export const everhourDb = db.collection(collections.everhour.name)
export const logsDb = db.collection(collections.log.name)
export const paramsDb = db.collection(collections.parameters.name)

export const projectDb = db.collection('project')

export const pageDb = db.collection('page')