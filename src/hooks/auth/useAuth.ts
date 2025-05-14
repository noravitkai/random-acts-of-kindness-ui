import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";
import { jwtDecode } from "jwt-decode";

/**
 * Handles signup, login, logout, session tracking, and current user state
 * @returns auth helpers and user info
 */

type JWTPayload = {
  userId: string;
  username: string;
  email: string;
  role: "user" | "admin";
  exp: number;
};

// Data sent to the server when user signs up
export type RegisterData = {
  username: string;
  email: string;
  password: string;
};

// Data sent to the server when user logs in
export type LoginData = {
  email: string;
  password: string;
};

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const logoutTimer = useRef<number | null>(null);

  /**
   * Clears session and logs the user out
   * Redirects based on the role
   */
  const logout = useCallback(() => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    localStorage.removeItem("lsToken");
    setUser(null);
    const redirectPath = pathname.startsWith("/admin")
      ? "/admin/login"
      : "/login";
    router.replace(redirectPath);
  }, [router, pathname]);

  /**
   * Auto-logs out user when a token expires
   * @param exp – expiration timestamp of token from JWT
   */
  const scheduleLogout = useCallback(
    (exp: number) => {
      const msUntilExpiry = exp * 1000 - Date.now();
      if (msUntilExpiry <= 0) {
        logout();
      } else {
        logoutTimer.current = window.setTimeout(() => {
          logout();
        }, msUntilExpiry);
      }
    },
    [logout]
  );

  // Check token on first load and setup auto-logout
  useEffect(() => {
    const token = localStorage.getItem("lsToken");
    if (token) {
      try {
        const payload = jwtDecode<JWTPayload>(token);
        setUser({
          id: payload.userId,
          username: payload.username,
          email: payload.email,
          role: payload.role,
        });
        scheduleLogout(payload.exp);
      } catch {
        localStorage.removeItem("lsToken");
      }
    }
    setInitialized(true);
    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, [scheduleLogout]);

  // Sync logout/login state across multiple tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "lsToken") {
        const newToken = e.newValue;
        if (newToken) {
          try {
            const payload = jwtDecode<JWTPayload>(newToken);
            setUser({
              id: payload.userId,
              username: payload.username,
              email: payload.email,
              role: payload.role,
            });
            scheduleLogout(payload.exp);
          } catch {
            localStorage.removeItem("lsToken");
            setUser(null);
          }
        } else {
          if (logoutTimer.current) clearTimeout(logoutTimer.current);
          setUser(null);
          const redirectPath = pathname.startsWith("/admin")
            ? "/admin/login"
            : "/login";
          router.replace(redirectPath);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [scheduleLogout, router, pathname]);

  /**
   * Calls login API with form data
   * @param data - login details
   * @returns the logged in User object
   * @throws error with a message on failure
   */
  async function login(data: LoginData): Promise<User> {
    setError(null);
    try {
      const res = await fetcher<{ token: string; user: User }>(
        "https://random-acts-of-kindness-api.onrender.com/api/user/login",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!res) throw new Error("No response from server");
      localStorage.setItem("lsToken", res.token);
      setUser(res.user);
      const payload = jwtDecode<JWTPayload>(res.token);
      scheduleLogout(payload.exp);
      return res.user;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      throw err;
    }
  }

  /**
   * Calls register API with form data
   * @param data - registration details
   * @returns the created User object
   * @throws error with a message on failure
   */
  async function register(data: RegisterData): Promise<User> {
    setError(null);
    try {
      const res = await fetcher<{ message: string; data: User }>(
        "https://random-acts-of-kindness-api.onrender.com/api/user/register",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!res) throw new Error("No response from server");
      return res.data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      throw err;
    }
  }

  return {
    user,
    error,
    login,
    register,
    logout,
    initialized,
  };
}
