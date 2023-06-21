import {initializeApp, cert} from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

// const firebaseCredential = process.env.FIREBASE_CREDENTIALS_PATH;
// let serviceAccount: any ;
//
// if(firebaseCredential != undefined){
//     serviceAccount = require(firebaseCredential);
// }
//
// const firebaseConfig = {
//     credential: cert(serviceAccount),
// }

const certConfig: any = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIBREASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
}

const firebaseConfig = {
    credential: cert(certConfig),
}


const app = initializeApp(firebaseConfig);

export default app;