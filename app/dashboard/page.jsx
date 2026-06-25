"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (user.role === "buyer") {
        router.push("/dashboard/buyer/overview");
      } else if (user.role === "seller") {
        router.push("/dashboard/seller/overview");
      } else if (user.role === "admin") {
        router.push("/dashboard/admin/overview");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
