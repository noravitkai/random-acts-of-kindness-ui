"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("lsToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    let payload: { role: string };
    try {
      payload = jwtDecode<{ role: string }>(token);
    } catch {
      router.replace("/login");
      return;
    }
    if (payload.role !== "user") {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  return authorized ? <>{children}</> : null;
}
