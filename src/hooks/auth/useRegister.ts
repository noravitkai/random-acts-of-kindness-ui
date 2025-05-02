import { useState } from "react";
import { fetcher } from "@/utils/fetcher";
import type { User } from "@/types/user";

// Data sent to the server when user signs up
export type RegisterData = {
  username: string;
  email: string;
  password: string;
};

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
      const user = await fetcher<User>( // Send request
        "http://localhost:4000/api/user/register",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!user) throw new Error("No user returned"); // Check if user is returned
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
