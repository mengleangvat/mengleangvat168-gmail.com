import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import config from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId if provided
export const db = config.firestoreDatabaseId
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Auto-authenticate anonymously for seamless real-time access
signInAnonymously(auth).catch((err) => {
  console.warn('Anonymous authentication note:', err);
});

// Validate connection to Firestore as per guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration or internet connection.');
    }
  }
}
testConnection();
