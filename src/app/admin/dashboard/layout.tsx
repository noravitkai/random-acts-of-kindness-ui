"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";

/**
 * Only shows content if the user is an admin
 * @param {object} props
 * @param {ReactNode} props.children – nested dashboard content
 * @returns {JSX.Element | null}
 */

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to be ready
    if (!initialized) return;
    // If not admin, redirect to admin login page
    if (user === null || user.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return null;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  {
    /* ===== Dashboard Layout Wrapper ===== */
  }
  return <>{children}</>;
}
