import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBUIaX19MxbTW5GsNCgJEDj1Jpg6D_Ps4s",
    authDomain: "ab-movies-3bad0.firebaseapp.com",
    projectId: "ab-movies-3bad0",
    storageBucket: "ab-movies-3bad0.appspot.com",
    messagingSenderId: "219446066648",
    appId: "1:219446066648:web:f797b342462b25f9bcc6ad"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
