"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * Decode JWT payload
 */
function decodeJwt<T>(token: string): T {
  const [, payloadBase64] = token.split(".");
  const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(base64);
  return JSON.parse(json) as T;
}

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
      payload = decodeJwt<JWTPayload>(token);
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
