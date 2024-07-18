import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyApuLp9x5-IgJTIfPw_-FeBryZ2mRF6tf4",
    authDomain: "react-project-a279d.firebaseapp.com",
    projectId: "react-project-a279d",
    storageBucket: "react-project-a279d.appspot.com",
    messagingSenderId: "879892265212",
    appId: "1:879892265212:web:34aaaf44ec9632b69a7f79"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
