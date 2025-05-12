// Helper to call fetch(), handle JSON, and surface errors

import { jwtDecode } from "jwt-decode";

/**
 * A wrapper around fetch()
 * @template T - the expected shape of the JSON response
 * @param url - API endpoint to call
 * @param init - extra options like method, body
 * @returns the JSON body parsed as T or null if there's no content
 */
export async function fetcher<T>(
  url: string,
  init?: RequestInit
): Promise<T | null> {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("lsToken");
    if (token) {
      try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        if (Date.now() >= exp * 1000) {
          localStorage.removeItem("lsToken");
          const redirectPath = window.location.pathname.startsWith("/admin")
            ? "/admin/login"
            : "/login";
          window.location.replace(redirectPath);
          throw new Error("Session expired");
        }
      } catch {
        localStorage.removeItem("lsToken");
        window.location.replace("/login");
        throw new Error("Invalid session");
      }
    }
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["auth-token"] = token;
  }
  const response = await fetch(url, {
    headers,
    ...init,
  });
  if (response.status === 401) {
    localStorage.removeItem("lsToken");
    const redirectPath = window.location.pathname.startsWith("/admin")
      ? "/admin/login"
      : "/login";
    window.location.replace(redirectPath);
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {}
    throw new Error(message);
  }
  if (response.status === 204) {
    return null;
  }
  const payload = await response.json();
  return payload as T;
}
