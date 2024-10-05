// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogbugster.firebaseapp.com",
  projectId: "blogbugster",
  storageBucket: "blogbugster.appspot.com",
  messagingSenderId: "534315068055",
  appId: "1:534315068055:web:9074c04fdbed2d034097d2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
