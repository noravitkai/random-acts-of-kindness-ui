"use client";

import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { useAuth, RegisterData } from "@/hooks/auth/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Fragment, useState as useLocalState } from "react";
import { Transition } from "@headlessui/react";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

/**
 * Shows form for signup, validates input and registers a user
 * @returns {JSX.Element} – page component that lets users create an account
 */
export default function RegisterPage() {
  const { register, error: serverError } = useAuth(); // Rename hook's error to serverError so it doesn't conflict with form errors
  const router = useRouter();

  // Form data state
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });

  // Toast notification state
  const [notification, setNotification] = useLocalState<{
    message: string;
  } | null>(null);

  /**
   * Updates form state when input fields change
   * @param {ChangeEvent<HTMLInputElement>} e – the input field event
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // Extract field name and value from the event
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }, []);

  /**
   * Checks the form inputs and shows a toast if something's wrong
   * @returns {boolean} – true if the form is valid, and false otherwise
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
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
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0]!;
      setNotification({ message: firstError });
      setTimeout(() => setNotification(null), 5000);
      return false;
    }
    return true;
  };

  /**
   * Validates the form, registers the user and redirects to login
   * @param {FormEvent<HTMLFormElement>} e – form event triggering
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const user = await register(formData);
      console.log("User signed up:", user);
      router.push("/login");
    } catch {
      // Fallback message if server doesn't provide one
      setNotification({
        message: serverError || "Registration failed. Try again, please.",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <>
      {/* ===== Toast Notification ===== */}
      <Transition
        show={!!notification}
        as={Fragment}
        enter="transform transition ease-out duration-300"
        enterFrom="translate-y-2 opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          aria-live="assertive"
          className="fixed inset-0 flex items-start px-4 pt-6 pointer-events-none z-50"
        >
          <div className="w-full max-w-sm mx-auto">
            <div className="pointer-events-auto rounded-lg bg-background shadow-lg ring-1 ring-black/5 overflow-hidden">
              <div className="p-4 flex items-center">
                <ExclamationCircleIcon className="w-6 h-6 text-primary" />
                <div className="ml-3 text-sm text-gray-900 flex-1">
                  {notification?.message}
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="ml-4 rounded-md bg-background text-gray-400 hover:text-gray-500 transition ease-in-out duration-300 cursor-pointer"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      {/* ===== Sign-Up Page Layout ===== */}
      <main>
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <div className="w-full max-w-sm space-y-6">
            <div className="flex justify-center mb-6">
              <Link href="/">
                <Image src="/logo.svg" alt="Logo" width={80} height={80} />
              </Link>{" "}
            </div>
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
                  className="relative block w-full rounded-t-md border-0 px-3 py-2 text-sm text-foreground placeholder:text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="relative block w-full border-t border-gray-300 px-3 py-2 text-sm text-foreground placeholder:text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />

                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="relative block w-full rounded-b-md border-t border-gray-300 px-3 py-2 text-sm text-foreground placeholder:text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary transition duration-300 hover:text-secondary"
                  >
                    Log in!
                  </Link>
                </p>
                <div className="relative group inline-block">
                  <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
                  <button
                    type="submit"
                    className="relative z-10 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background hover:bg-secondary transition duration-300 cursor-pointer"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
