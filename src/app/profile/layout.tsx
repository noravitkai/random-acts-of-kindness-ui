"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";

/**
 * Only shows content to regular users
 * @param {object} props
 * @param {ReactNode} props.children – the profile content to show
 * @returns {JSX.Element | null}
 */
export default function ProfileLayout({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth is ready
    if (!initialized) return;
    // If not a regular user, redirect to login
    if (user === null || user.role !== "user") {
      router.replace("/login");
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return null;
  }

  if (!user || user.role !== "user") {
    return null;
  }

  {
    /* ===== Profile Layout Wrapper ===== */
  }
  return <>{children}</>;
}
