"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
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

  return <>{children}</>;
}
