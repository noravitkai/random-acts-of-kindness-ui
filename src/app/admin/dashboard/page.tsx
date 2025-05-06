"use client";
import { useAuth } from "@/hooks/auth/useAuth";

export default function Dashboard() {
  const { logout } = useAuth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        <div className="text-center">
          <button
            onClick={logout}
            className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition ease-in-out duration-300 hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
