/*// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDebGypTWk-qeJ6WylOIVAl0XEEprREkPE",
  authDomain: "novacode-logistica.firebaseapp.com",
  projectId: "novacode-logistica",
  storageBucket: "novacode-logistica.firebasestorage.app",
  messagingSenderId: "326329296490",
  appId: "1:326329296490:web:cd0583b7b4e1169f91cc13",
  measurementId: "G-RDRL2CHYJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);*/

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCPwETxFZTMwIP6EirqkG9Rl0Ago-CvGBw",
  authDomain: "prueba-3f672.firebaseapp.com",
  projectId: "prueba-3f672",
  storageBucket: "prueba-3f672.firebasestorage.app",
  messagingSenderId: "1086584707269",
  appId: "1:1086584707269:web:b4f5b0719d63ae0638b8ac",
  measurementId: "G-QPVFBQYVY3"
};

const app = initializeApp(firebaseConfig);

// 🔹 esto es lo que te faltaba
export const auth = getAuth(app);

// analytics (opcional)
const analytics = getAnalytics(app);