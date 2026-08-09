// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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