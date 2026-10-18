import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDpRCVDgKY69zsx5dR2CJXr6nKmmGZbQao",
  authDomain: "evaluacion-direccion.firebaseapp.com",
  projectId: "evaluacion-direccion",
  storageBucket: "evaluacion-direccion.firebasestorage.app",
  messagingSenderId: "711138938347",
  appId: "1:711138938347:web:d3ad7f04bac970d3221dae"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function ensureAnonymousAuth() {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      console.error('Error autenticando anónimamente en Firebase:', err);
    }
  }
  return auth.currentUser;
}
