import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXxCRITbJJisxiLn06m81gCXpa7Q81r_w",
  authDomain: "nextlogsign.firebaseapp.com",
  projectId: "nextlogsign",
  storageBucket: "gs://nextlogsign.appspot.com",
  messagingSenderId: "731741743841",
  appId: "1:731741743841:web:17e443b3b322c47b4ce5a0",
  measurementId: "G-HZ9999Q3XH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


