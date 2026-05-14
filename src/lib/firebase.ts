import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Use initializeFirestore for more control over settings if needed
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

async function testConnection() {
  try {
    // Non-blocking test
    const testDoc = doc(db, 'test', 'connection');
    // Using a timeout for the test specifically
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firebase connection timeout')), 5000)
    );
    
    await Promise.race([
      getDocFromServer(testDoc),
      timeoutPromise
    ]);
    
    console.log("Firebase connection successful");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('the client is offline') || error.message.includes('timeout')) {
        console.warn("Firebase is currently in offline mode or slow to connect. This is expected in some environments.");
      } else {
        console.error("Firebase connection test error:", error.message);
      }
    }
  }
}

// Run connection test without blocking app startup
testConnection();
