"use client";

import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { useRegister, RegisterData } from "@/hooks/auth/useRegister";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Render the signup form and handle the registration flow
 * Manage form state, perform client-side validation, and call the registration API
 */
export default function RegisterPage() {
  const { register, error: serverError } = useRegister(); // Rename hook's error to serverError so it doesn't clash with form errors
  const router = useRouter(); // Router for redirection after successful registration

  // Form data state
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });
  // Form error state
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterData, string>>
  >({});

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
    const newErrors: typeof errors = {};
    if (!formData.username) newErrors.username = "Please provide a username.";
    else if (formData.username.length < 2)
      newErrors.username = "Username must be at least 2 characters.";
    if (!formData.email) newErrors.email = "Please provide an email.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email format is invalid.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    else if (formData.password.length > 20)
      newErrors.password = "Password cannot exceed 20 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit handler for the registration form
   * Run validation, call register(), and redirect on success
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const user = await register(formData);
      console.log("User signed up:", user);
      router.push("/login");
    } catch {
      // TODO: Display UI feedback
      console.log("Server error:", serverError);
    }
  };

  return (
    <>
      <main>
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <div className="w-full max-w-sm space-y-6">
            <h2 className="text-center text-2xl font-bold text-foreground">
              Sign up for an account
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="relative block w-full rounded-t-md border-0 px-3 py-2 text-sm text-foreground placeholder:text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.username && (
                  <p className="text-xs text-red-500">{errors.username}</p>
                )}

                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="relative block w-full border-t border-gray-300 px-3 py-2 text-sm text-foreground placeholder:text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary"
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
                  Sign up
                </button>
              </div>
            </form>
            {serverError && (
              <p className="text-center text-sm text-red-500">{serverError}</p>
            )}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary transition duration-300 hover:text-secondary"
              >
                Log in!
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
