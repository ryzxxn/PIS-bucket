import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebase_config = {
    apiKey: "AIzaSyAnka2evTqdYFaQPMMjMjZeJMkgN4KXzNA",
    authDomain: "test-13d49.firebaseapp.com",
    databaseURL: "https://test-13d49-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "test-13d49",
    storageBucket: "test-13d49.appspot.com",
    messagingSenderId: "568039792086",
    appId: "1:568039792086:web:898a25d276a2f5f720d877",
    measurementId: "G-ZDJRKW6VNV"
}

const app = initializeApp(firebase_config);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };