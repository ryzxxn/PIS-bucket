import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.apiKey || 'AIzaSyDmYChNVmFUPPCqTjBrEqHuIjkmRs_uDDk',
  authDomain: import.meta.env.authDomain || 'pis-image.firebaseapp.com',
  databaseURL: import.meta.env.databaseURL || 'https=//pis-image-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.projectId || 'pis-image',
  storageBucket: import.meta.env.storageBucket || 'pis-image.appspot.com',
  messagingSenderId: import.meta.env.messagingSenderId || '236102462633',
  appId: import.meta.env.appId || '1:236102462633:web:8a05058c202f46e032cdb8',
  measurementId: import.meta.env.measurementId || 'G-QW5EQSYJ0L'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };