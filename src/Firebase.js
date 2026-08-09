// src/Firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDnuxhbcc7XL3o5yWfXqe4ihvoolcm5deA",
  authDomain: "math-swipe.firebaseapp.com",
  projectId: "math-swipe",
  storageBucket: "math-swipe.firebasestorage.app",
  messagingSenderId: "856595090752",
  appId: "1:856595090752:web:335303d30dc62945c6bea5",
  measurementId: "G-PQ7P2DVEJ8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export everything
export {
  app,
  analytics,
  auth,
  db,
  storage,
  // Auth functions
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  signOut,
  // Firestore functions
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  // Storage functions
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};