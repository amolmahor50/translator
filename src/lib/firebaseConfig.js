// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, deleteUser,reauthenticateWithPopup } from "firebase/auth";
import { getDatabase, ref, push, set, get, remove, child } from "firebase/database";
import { doc, getDoc, setDoc, getFirestore, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmLf0YTdGYMGz0TxoucBUgymKj5FgLkeU",
  authDomain: "translator-a0afd.firebaseapp.com",
  projectId: "translator-a0afd",
  storageBucket: "translator-a0afd.firebasestorage.app",
  messagingSenderId: "137183019852",
  appId: "1:137183019852:web:0c79f04919a508d0f885e9",
  measurementId: "G-JJNMN1H752"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const firebaseStore = getFirestore(app);
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { app, db, firebaseStore, auth, ref, push, set, get, remove,
   child, googleProvider, facebookProvider,deleteDoc, deleteUser,
    onAuthStateChanged, doc, getDoc, setDoc,reauthenticateWithPopup
   };
