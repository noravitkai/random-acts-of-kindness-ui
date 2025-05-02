import { useState } from "react";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";

// Data sent to the server when user logs in
export type LoginData = {
  email: string;
  password: string;
};

/**
 * Log in an existing user
 * Save the returned token to localStorage and return login() and error
 */
export function useLogin() {
  const [error, setError] = useState<string | null>(null); // Hold error messages

  /**
   * Attempt to log in with email/password
   * @param data – the user’s email & password
   * @returns User object on success
   * @throws Error with a user-friendly message on failure
   */
  async function login(data: LoginData): Promise<User> {
    setError(null); // Reset error state

    try {
      const res = await fetcher<{ token: string; user: User }>( // Send request
        "http://localhost:4000/api/user/login",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      // Check if the response is valid
      if (!res) {
        throw new Error("Login response was empty");
      }
      const { token, user } = res; // Extract the token and user from the response

      // Save the JWT token to localStorage
      localStorage.setItem("lsToken", token);

      return user;
    } catch (err: unknown) {
      // Catch any potential errors
      console.error("Login error:", err);
      const message = "Login failed. Check your email/password.";
      setError(message); // Update state to show error message in the form
      throw new Error(message);
    }
  }

  return { login, error };
}
