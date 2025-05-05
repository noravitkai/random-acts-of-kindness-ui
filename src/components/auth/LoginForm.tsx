"use client";

import { FC, useState, useCallback, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

export type LoginFormData = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  serverError?: string | null;
  signupLink?: { href: string; text: string };
}

/**
 * Shared login form component
 */
export const LoginForm: FC<LoginFormProps> = ({
  onSubmit,
  serverError,
  signupLink,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }, []);

  const validateForm = () => {
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email format is invalid.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  return (
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
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
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
      {serverError && (
        <p className="text-center text-sm text-red-500">{serverError}</p>
      )}
      {signupLink && (
        <p className="text-center text-sm text-gray-500">
          Don’t have an account yet?{" "}
          <Link
            href={signupLink.href}
            className="font-medium text-primary transition duration-300 hover:text-secondary"
          >
            {signupLink.text}
          </Link>
        </p>
      )}
    </form>
  );
};
