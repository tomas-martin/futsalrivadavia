"use client";

import { useState, useEffect } from "react";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session storage for admin session
    const session = sessionStorage.getItem("fr_admin");
    setIsLoggedIn(session === "1");
    setIsLoading(false);
  }, []);

  const handleLogin = (user: string, pass: string): boolean => {
    // TODO: Replace with Supabase Auth
    const validUser = "admin";
    const validPass = "rivadavia2024";

    if (user === validUser && pass === validPass) {
      sessionStorage.setItem("fr_admin", "1");
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    sessionStorage.removeItem("fr_admin");
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-orange border-t-transparent mx-auto" />
          <p className="text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
