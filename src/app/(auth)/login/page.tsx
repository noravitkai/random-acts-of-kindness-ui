"use client";

import { useState } from "react";
import { useAuth, LoginData } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

/**
 * Render the login form and handle the login flow
 * Manage form state, perform client-side validation, and call the login API
 */
export default function LoginPage() {
  const { login, error: serverError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(data: LoginData) {
    setLocalError(null);
    const user = await login(data);
    console.log("User logged in:", user);
    if (user.role !== "user") {
      setLocalError("Admins must log in via the admin login page.");
      return;
    }
    router.push("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-bold text-foreground">
          Log in to kick off a good deed
        </h1>
        <LoginForm
          onSubmit={handleSubmit}
          serverError={localError || serverError}
          signupLink={{ href: "/signup", text: "Sign up!" }}
        />
      </div>
    </main>
  );
}
