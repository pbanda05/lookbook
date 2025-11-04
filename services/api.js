import { Platform } from "react-native";

const LOCALHOST =
  Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

// If you test on a real phone, replace with your Mac's LAN IP:
// const LOCALHOST = "http://192.168.1.123:8080";

export async function apiFetch(path, opts = {}) {
  const res = await fetch(`${LOCALHOST}${path}`, opts);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}
