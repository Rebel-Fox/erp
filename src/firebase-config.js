// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUde6rhxdxtf2NCov6K-u2T4GaKTCoTsA",
  authDomain: "erportal-f8a6e.firebaseapp.com",
  projectId: "erportal-f8a6e",
  storageBucket: "erportal-f8a6e.firebasestorage.app",
  messagingSenderId: "541894809146",
  appId: "1:541894809146:web:d4684c36decd455e910703"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const fireBaseAuth = getAuth(app);
export const db = getFirestore(app);