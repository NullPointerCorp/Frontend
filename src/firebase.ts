// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZl8-B7hJQrl83igJ2ofDthPvr6BLpHdc",
  authDomain: "novalogistics-607d2.firebaseapp.com",
  projectId: "novalogistics-607d2",
  storageBucket: "novalogistics-607d2.firebasestorage.app",
  messagingSenderId: "674523099681",
  appId: "1:674523099681:web:b0ce3b2193cf772a5ca960"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);