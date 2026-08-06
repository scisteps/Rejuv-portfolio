// src/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// Central Firebase initialization file.
// Import db and storage from here everywhere in the app.
//
// HOW TO FILL THIS IN:
//  1. Go to Firebase Console → your project → Project Settings (gear icon)
//  2. Scroll to "Your apps" → click your web app → copy the firebaseConfig object
//  3. Paste those values into your .env file (see comments below)
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// All values come from .env — never hardcode keys in source files
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

// ── Validation — warn clearly if any key is missing ──────────────────────────
const REQUIRED_KEYS = [
  'apiKey', 'authDomain', 'projectId',
  'storageBucket', 'messagingSenderId', 'appId',
];

const missingKeys = REQUIRED_KEYS.filter(k => !firebaseConfig[k]);
if (missingKeys.length > 0) {
  console.error(
    '[Firebase] Missing environment variables:',
    missingKeys.map(k => `REACT_APP_FIREBASE_${k.replace(/([A-Z])/g, '_$1').toUpperCase()}`),
    '\nCheck your .env file and restart npm start.'
  );
}

// ── Initialize — prevent duplicate app on hot reload ────────────────────────
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ── Exports ──────────────────────────────────────────────────────────────────
export const db      = getFirestore(app); // Firestore database
export const storage = getStorage(app);   // Firebase Storage (images)
export default app;
