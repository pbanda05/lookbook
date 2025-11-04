// firebaseConfig.js
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD11czYJPWmDceb1xb0JYOzNz9hkntm9N8",
  authDomain: "lookbook-bce46.firebaseapp.com",
  projectId: "lookbook-bce46",
  storageBucket: "lookbook-bce46.firebasestorage.app",
  messagingSenderId: "897402009993",
  appId: "1:897402009993:web:f3f15d22c4a91364830958",
};

export function getFirebaseAuth() {
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  return getAuth(app);
}
