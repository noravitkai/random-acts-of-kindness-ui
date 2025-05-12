"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
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

  return <>{children}</>;
}
