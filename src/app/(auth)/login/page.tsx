"use client";

import { useAuth, LoginData } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";

/**
 * Shows a login form and handles form submission + redirection
 * @returns {JSX.Element} – page component that lets users log in
 */
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  /**
   * Handles login form submission
   * @param {LoginData} data – login data from the form
   * @returns {Promise<void>}
   */
  async function handleSubmit(data: LoginData) {
    const user = await login(data);
    console.log("User logged in:", user);
    if (user.role !== "user") {
      throw new Error("Admins must log in via the admin login page.");
    }
    router.push("/profile");
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
        <h1 className="text-center text-2xl font-bold text-foreground">
          Log in to kick off a good deed
        </h1>
        <LoginForm
          onSubmit={handleSubmit}
          signupLink={{ href: "/signup", text: "Sign up!" }}
        />
      </div>
    </main>
  );
}
