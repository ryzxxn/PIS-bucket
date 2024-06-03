import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.apiKey || 'AIzaSyDmYChNVmFUPPCqTjBrEqHuIjkmRs_uDDk',
  authDomain: process.env.authDomain || 'pis-image.firebaseapp.com',
  databaseURL: process.env.databaseURL || 'https=//pis-image-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: process.env.projectId || 'pis-image',
  storageBucket: process.env.storageBucket || 'pis-image.appspot.com',
  messagingSenderId: process.env.messagingSenderId || '236102462633',
  appId: process.env.appId || '1:236102462633:web:8a05058c202f46e032cdb8',
  measurementId: process.env.measurementId || 'G-QW5EQSYJ0L'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const api = process.env.apiKey

export { auth, provider, api };