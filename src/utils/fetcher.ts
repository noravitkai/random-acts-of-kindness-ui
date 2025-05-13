// Shared fetch helper – adds token, checks for session, and returns data

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
  // Grab the token from localStorage
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("lsToken");
    // If token exists, check if it's still valid
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
  // Set up headers, include token if we have one
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
  // If the user is not allowed (401), log them out and send to login page
  if (response.status === 401) {
    localStorage.removeItem("lsToken");
    const redirectPath = window.location.pathname.startsWith("/admin")
      ? "/admin/login"
      : "/login";
    window.location.replace(redirectPath);
    throw new Error("Unauthorized");
  }
  // If something else went wrong, try to get the error message
  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
    } catch {}
    throw new Error(message);
  }
  // If server response is no content, just return null
  if (response.status === 204) {
    return null;
  }
  // Return the data got
  const payload = await response.json();
  return payload as T;
}
