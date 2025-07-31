// Firebase config file
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config from Firebase console
export const firebaseConfig = {
  apiKey: "AIzaSyBHH8gwlQRzwkVWMacA9gOVxxsBFt2tbC4",
  authDomain: "nutrisense-5e2e8.firebaseapp.com",
  projectId: "nutrisense-5e2e8",
  storageBucket: "nutrisense-5e2e8.appspot.com",
  messagingSenderId: "925478585043",
  appId: "1:925478585043:web:63cb40248e84a7a782ca26",
  // measurementId: "G-TJ2BDXF5X7", // optional
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
