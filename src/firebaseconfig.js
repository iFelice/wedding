// src/firebaseconfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, remove } from "firebase/database";  // Importa Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "wedding-f397b.firebaseapp.com",
  databaseURL: "https://wedding-f397b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wedding-f397b",
  storageBucket: "wedding-f397b.firebasestorage.app",
  messagingSenderId: "70395368982",
  appId: "1:70395368982:web:e94179c955fb6476820737",
  measurementId: "G-DN9NSYMS4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);  // Inizializza Realtime Database

export { database, ref, push, set, onValue, remove };  // Esporta le funzioni necessarie