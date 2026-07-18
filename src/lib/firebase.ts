import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, onSnapshot, query, orderBy, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAXoDc7RFXqqKYmc5C5fcmZaviX9i3sRpQ",
  authDomain: "abdullah-al-baki-b89ce.firebaseapp.com",
  projectId: "abdullah-al-baki-b89ce",
  storageBucket: "abdullah-al-baki-b89ce.firebasestorage.app",
  messagingSenderId: "193682736657",
  appId: "1:193682736657:web:31bd54794f1ab3fa4113b0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export { collection, addDoc, getDocs, doc, setDoc, getDoc, onSnapshot, query, orderBy, deleteDoc, updateDoc };
