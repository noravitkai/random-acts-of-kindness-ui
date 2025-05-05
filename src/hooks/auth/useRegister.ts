import { useState } from "react";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";

// Data sent to the server when user signs up
export type RegisterData = {
  username: string;
  email: string;
  password: string;
};

// Response from the server when user signs up
interface RegisterResponse {
  message: string;
  data: User;
}

/**
 * Register a new user
 * Return register() and error
 */
export function useRegister() {
  const [error, setError] = useState<string | null>(null); // Hold error messages

  /**
   * Call register API with form data
   * @param data - registration details
   * @returns the created User object
   * @throws error with a message on failure
   */
  async function register(data: RegisterData): Promise<User> {
    setError(null); // Reset error state
    try {
      // Call the API and get the wrapped response
      const res = await fetcher<RegisterResponse>(
        "http://localhost:4000/api/user/register",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!res) throw new Error("No response from server"); // Check if response is valid
      const user = res.data; // Actual user object
      return user;
    } catch (error: unknown) {
      // Catch any potential errors
      console.error("Register error:", error);
      const message = "The registration process failed. Try again, please.";
      setError(message); // Update state to show error message in the form
      throw new Error(message);
    }
  }

  return { register, error };
}
