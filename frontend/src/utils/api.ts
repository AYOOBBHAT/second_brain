import { devLogger } from "./devLogger";

export function normalizeBackendBase(rawBase: string) {
  const rb = (rawBase ?? "").trim();
  // remove trailing dots and slashes
  let u = rb.replace(/\.+$|\/+$/g, "");
  // ensure API prefix exists
  if (!u.includes("/api/v1")) {
    u = u + "/api/v1";
  }
  return u;
}

const rawBase = (import.meta.env.VITE_BACKEND_URL as string) ?? "http://localhost:5000/api/v1";
const normalizedBase = normalizeBackendBase(rawBase);

if (rawBase !== normalizedBase) {
  devLogger.debug("sanitized backend base from env", { rawBase, normalizedBase });
}

export function getApiUrl(path: string) {
  const base = normalizedBase;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base}${path}`;
}
