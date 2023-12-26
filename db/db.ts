//Firestore DB
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../tokens/firestore'

const firebaseApp = initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore(firebaseApp, process.env.NODE_ENV == 'development' ? 'lpds-dev' : '(default)')
export default db