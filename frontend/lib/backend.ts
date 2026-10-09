import axios from "axios";
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
// A real API response confirms both Render startup and model readiness.
// Stop after two minutes; never run a background keep-alive loop.
export async function waitForLocations(signal: AbortSignal): Promise<string[]> {
 const deadline = Date.now() + 120000;
 while (!signal.aborted && Date.now() < deadline) {
  try {
   const response = await axios.get(`${API_URL}/locations`, { signal, timeout: Math.min(12000, deadline - Date.now()) });
   const locations: unknown = response.data.locations;
   if (Array.isArray(locations) && locations.length && locations.every(x => typeof x === "string" && x.trim())) return locations;
  } catch { if (signal.aborted) throw new Error("cancelled"); }
  await new Promise<void>((resolve) => {
   const finish = () => { clearTimeout(timer); signal.removeEventListener("abort", finish); resolve(); };
   const timer = setTimeout(finish, Math.min(2000, Math.max(0, deadline - Date.now())));
   signal.addEventListener("abort", finish, { once: true });
   if (signal.aborted) finish();
  });
 }
 throw new Error("unavailable");
}
