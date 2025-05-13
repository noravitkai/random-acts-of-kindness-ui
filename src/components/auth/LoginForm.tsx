"use client";

import {
  FC,
  useState,
  useCallback,
  ChangeEvent,
  FormEvent,
  Fragment,
} from "react";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

export type LoginFormData = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  signupLink?: { href: string; text: string };
}

/**
 * Validates fields, shows error toast if needed, and submits data on the form
 * @param {LoginFormProps} props – submit handler and optional sign-up link
 * @returns {JSX.Element} – shared login form component (users & admins)
 */
export const LoginForm: FC<LoginFormProps> = ({ onSubmit, signupLink }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState<{ message: string } | null>(
    null
  );

  /**
   * Updates form state when input fields change
   * @param {ChangeEvent<HTMLInputElement>} e – input change event
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }, []);

  /**
   * Validates the form fields and shows error toast if needed
   * @returns {boolean} – true if form is valid, and false otherwise
   */
  const validateForm = () => {
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email format is invalid.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0]!;
      setNotification({ message: firstError });
      setTimeout(() => setNotification(null), 5000);
      return false;
    }
    return true;
  };

  /**
   * Handles form submission and passes data to parent onSubmit
   * @param {FormEvent<HTMLFormElement>} e – submit event triggered
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onSubmit(formData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setNotification({
        message: msg || "Login failed. Try again, please.",
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
      {/* ===== Login Form Layout ===== */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="relative block w-full rounded-t-md border-0 px-3 py-2 text-sm text-foreground placeholder:text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-900"
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
        <div
          className={`flex items-center text-sm text-gray-500 mt-4 ${
            signupLink ? "justify-between" : "justify-end"
          }`}
        >
          {signupLink && (
            <p className="text-sm text-gray-500">
              Don’t have an account yet?{" "}
              <Link
                href={signupLink.href}
                className="font-medium text-primary transition duration-300 hover:text-secondary"
              >
                {signupLink.text}
              </Link>
            </p>
          )}
          <div className="relative group inline-block float-right">
            <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-md border-2 border-dashed border-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
            <button
              type="submit"
              className="relative z-10 rounded-md border-2 border-black bg-primary px-4 py-2 text-sm font-semibold text-background hover:bg-secondary transition duration-300 cursor-pointer"
            >
              Log in
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
