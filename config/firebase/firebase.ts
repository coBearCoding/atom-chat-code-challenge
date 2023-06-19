import {initializeApp, cert} from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

const firebaseCredential = process.env.FIREBASE_CREDENTIALS_PATH;
let serviceAccount: any ;

if(firebaseCredential != undefined){
    serviceAccount = require(firebaseCredential);
}

const firebaseConfig = {
    credential: cert(serviceAccount),
}

const app = initializeApp(firebaseConfig);

export default app;