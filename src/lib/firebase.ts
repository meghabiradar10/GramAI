import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Mock configuration - replace with actual config when available
const firebaseConfig = {
  apiKey: "mock-api-key-replace-me",
  authDomain: "mock-gramai-dev.firebaseapp.com",
  projectId: "mock-gramai-dev",
  storageBucket: "mock-gramai-dev.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

// In development, you'd typically connect to Firebase Emulators here
// if (process.env.NODE_ENV === 'development') { ... }

export default app;
