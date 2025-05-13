"use client";

import { useAuth, LoginData } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";

/**
 * Shows a login form and handles login specifically for admins
 * @returns {JSX.Element}
 */
export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  /**
   * Handles login form submission
   * @param {LoginData} data – email and password entered by the admin
   * @returns {Promise<void>}
   */
  async function handleSubmit(data: LoginData) {
    const user = await login(data);
    if (user.role !== "admin") {
      throw new Error("Access denied to non-admin users.");
    }
    console.log("Admin logged in:", user);
    router.push("/admin/dashboard");
  }

  {
    /* ===== Login Page Layout ===== */
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" width={80} height={80} />
          </Link>{" "}
        </div>
        <h2 className="text-center text-2xl font-bold text-foreground">
          Log in to the Admin Dashboard
        </h2>
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
