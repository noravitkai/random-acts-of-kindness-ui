"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type JWTPayload = { role: string };

/**
 * Guard the admin dashboard redirecting non‐admins to /admin/login
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("lsToken");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    let payload: JWTPayload;
    try {
      payload = jwtDecode<JWTPayload>(token);
    } catch {
      router.replace("/admin/login");
      return;
    }

    if (payload.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  return authorized ? <>{children}</> : null;
}
