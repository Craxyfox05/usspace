// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBI5xQuBBgpS48V-bS438qiGr2qS9L6sQ",
  authDomain: "usspace-2bc42.firebaseapp.com",
  projectId: "usspace-2bc42",
  storageBucket: "usspace-2bc42.firebasestorage.app",
  messagingSenderId: "520916461897",
  appId: "1:520916461897:web:4232cca99c491d49a71298"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 