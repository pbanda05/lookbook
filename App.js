import { signInAnonymously } from "firebase/auth";
import React from "react";
import { Alert, Button, View } from "react-native";
import { getFirebaseAuth } from "./firebaseConfig";
import { apiFetch, BASE } from "./services/api";

async function testHealth() {
  try {
    const res = await fetch(`${BASE}/health`);
    const text = await res.text();
    Alert.alert("✅ Backend Responded", text);
  } catch (e) {
    Alert.alert("❌ Backend not reachable", e.message);
  }
}

async function testAuthFlow() {
    try {
      const auth = getFirebaseAuth();
  
      // 1) sign in (anonymous for now)
      const cred = await signInAnonymously(auth);
      const idToken = await cred.user.getIdToken();
  
      // 2) ensure user exists
      const syncRes = await fetch(`${BASE}/api/users/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!syncRes.ok) {
        const msg = await syncRes.text();
        throw new Error(`Sync failed: ${syncRes.status} ${msg}`);
      }
  
      // 3) fetch profile
      const meRes = await fetch(`${BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const me = await meRes.json();
  
      console.log("ME:", me);
      Alert.alert("✅ Auth Success", me?.user?.email || "user created");
    } catch (e) {
      console.error(e);
      Alert.alert("❌ Auth Error", String(e.message || e));
    }
  }
  


async function testBackendAuth() {
  try {
    const auth = getFirebaseAuth();
    const cred = await signInAnonymously(auth);
    const idToken = await cred.user.getIdToken();

    await apiFetch("/api/users/sync", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });

    const me = await apiFetch("/api/users/me", {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    console.log("ME:", me);
    Alert.alert("✅ Success", `Hello ${me.user?.email || "user"}!`);
  } catch (e) {
    console.error(e);
    Alert.alert("❌ Error", String(e.message || e));
  }
}

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Button title="Test Backend" onPress={testHealth} />
      <Button title="Test Auth" onPress={testAuthFlow} />
    </View>
  );
}
