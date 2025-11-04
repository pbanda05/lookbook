import { signInAnonymously } from "firebase/auth";
import React from "react";
import { Alert, Button, View } from "react-native";
import { getFirebaseAuth } from "./firebaseConfig";
import { apiFetch } from "./services/api";

async function testBackendAuth() {
  try {
    const auth = getFirebaseAuth();

    // 1) simple login
    const cred = await signInAnonymously(auth);
    const idToken = await cred.user.getIdToken();

    // 2) sync user to backend
    await apiFetch("/api/users/sync", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
    });

    // 3) get profile
    const me = await apiFetch("/api/users/me", {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    console.log("ME:", me);
    Alert.alert("✅ Success", `Welcome ${me.user?.email || "user"}!`);
  } catch (e) {
    console.error(e);
    Alert.alert("❌ Error", String(e.message || e));
  }
}

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Button title="Test Backend Connection" onPress={testBackendAuth} />
    </View>
  );
}
