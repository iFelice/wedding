// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhx86TvdGo7EyeJRXJjHidpnA5YB1vg8M",
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
const analytics = getAnalytics(app);
