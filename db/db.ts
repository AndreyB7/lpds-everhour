//Firestore DB
import fs from 'firebase-admin'
import serviceAccount from '../tokens/firestore'

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore()
export default db