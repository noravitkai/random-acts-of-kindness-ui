import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";
import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  userId: string;
  username: string;
  email: string;
  role: "user" | "admin";
};

// Data sent to the server when user logs in
export type LoginData = {
  email: string;
  password: string;
};

// Data sent to the server when user signs up
export type RegisterData = {
  username: string;
  email: string;
  password: string;
};

/**
 * Custom hook for authentication used in the signup and login pages
 * Register, login & logout functionality, along with error state, and the current user
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      } catch {
        // Invalid token
        localStorage.removeItem("lsToken");
      }
    }
  }, []);

  /**
   * Call login API with form data
   * @param data - login details
   * @returns the logged in User object
   * @throws error with a message on failure
   */
  async function login(data: LoginData): Promise<User> {
    setError(null);
    try {
      const res = await fetcher<{ token: string; user: User }>(
        "http://localhost:4000/api/user/login",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!res) throw new Error("No response from server");
      localStorage.setItem("lsToken", res.token);
      setUser(res.user);
      return res.user;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      throw err;
    }
  }

  /**
   * Call register API with form data
   * @param data - registration details
   * @returns the created User object
   * @throws error with a message on failure
   */
  async function register(data: RegisterData): Promise<User> {
    setError(null);
    try {
      const res = await fetcher<{ message: string; data: User }>(
        "http://localhost:4000/api/user/register",
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

  /**
   * Clear authentication state and redirect to the login page
   */
  function logout() {
    localStorage.removeItem("lsToken");
    setUser(null);
    router.replace("/login");
  }

  return {
    user,
    error,
    login,
    register,
    logout,
  };
}
