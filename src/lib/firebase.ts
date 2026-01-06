import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCb7jCSqEd30ymhZjXzXk1-UjDIF6oumpw",
    authDomain: "medikora-webapp-c0833.firebaseapp.com",
    projectId: "medikora-webapp-c0833",
    storageBucket: "medikora-webapp-c0833.firebasestorage.app",
    messagingSenderId: "766782209240",
    appId: "1:766782209240:web:2c62469f8bda04f5cbebad"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
