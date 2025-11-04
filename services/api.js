import { Platform } from "react-native";

const BASE =
  Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

export async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}
