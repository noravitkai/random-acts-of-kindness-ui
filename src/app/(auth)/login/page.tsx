"use client";

import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { useLogin, LoginData } from "@/hooks/auth/useLogin";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Render the login form and handle the login flow
 * Manage form state, perform client-side validation, and call the login API
 */
export default function LoginPage() {
  const { login, error: serverError } = useLogin(); // Rename hook's error to serverError so it doesn't clash with form errors
  const router = useRouter(); // Router for redirection after successful registration

  // Form data state
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  // Form error state
  const [errors, setErrors] = useState<Partial<LoginData>>({});

  /**
   * Handle input changes by updating formData
   * Prevent recreating this handler on render via useCallback
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // Extract field name and value from the event
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }, []);

  /**
   * Validate input fields and set error messages
   * TODO: Move these rules into a shared helper for reuse?
   */
  const validateForm = () => {
    const newErrors: Partial<LoginData> = {};
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email format is invalid.";
    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit handler for the login form
   * Run validation, call login(), and redirect on success
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(formData);
      router.push("/");
    } catch {
      console.log("Login failed:", serverError);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-center text-2xl font-bold text-foreground">
          Log in to your account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="relative block w-full rounded-t-md border-0 px-3 py-2 text-sm text-foreground placeholder:text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="relative block w-full rounded-b-md border-t border-gray-300 px-3 py-2 text-sm text-foreground placeholder:text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition ease-in-out duration-300 hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              Log in
            </button>
          </div>
        </form>
        {serverError && (
          <p className="text-center text-sm text-red-500">{serverError}</p>
        )}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account yet?{" "}
          <Link
            href="/register"
            className="font-medium text-primary transition duration-300 hover:text-secondary"
          >
            Sign up!
          </Link>
        </p>
      </div>
    </main>
  );
}
