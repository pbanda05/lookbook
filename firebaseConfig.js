import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD11czYJPWmDceb1xb0JYOzNz9hkntm9N8",
  authDomain: "lookbook-bce46.firebaseapp.com",
  projectId: "lookbook-bce46",
  storageBucket: "lookbook-bce46.firebasestorage.app",
  messagingSenderId: "897402009993",
  appId: "1:897402009993:web:f3f15d22c4a91364830958",
  measurementId: "G-3GC91Z9FMG"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { app, auth };
export default app;
