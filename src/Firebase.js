import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  arrayUnion, 
  onSnapshot, 
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
  increment,
  deleteDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAuUZ0mJvFy177CFvTsmutS2bO0FsTJ_9M",
  authDomain: "rejuv-1d74f.firebaseapp.com",
  projectId: "rejuv-1d74f",
  storageBucket: "rejuv-1d74f.firebasestorage.app",
  messagingSenderId: "963584606168",
  appId: "1:963584606168:web:58ae46f67fb0294219fcad",
  measurementId: "G-EBNXBFTFYG",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);

export { 
  app, 
  db, 
  auth, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  onSnapshot, 
  setDoc, 
  getDocs, 
  collection, 
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
  increment,
  deleteDoc
};