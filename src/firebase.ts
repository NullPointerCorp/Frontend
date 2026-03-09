// Import the functions you need from the SDKs you need
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
export const auth = getAuth(app);