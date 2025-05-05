"use client";

import { useState } from "react";
import { useLogin, LoginData } from "@/hooks/auth/useLogin";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

/**
 * Render the login form and handle the login flow
 */
export default function AdminLoginPage() {
  const { login, error: serverError } = useLogin();
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(data: LoginData) {
    setLocalError(null);
    const user = await login(data);
    if (user.role !== "admin") {
      setLocalError("Access denied to non-admin users.");
      return;
    }
    console.log("Admin logged in:", user);
    router.push("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-center text-2xl font-bold text-foreground">
          Log in to the Admin Dashboard
        </h2>
        <LoginForm
          onSubmit={handleSubmit}
          serverError={localError || serverError}
        />
      </div>
    </main>
  );
}
