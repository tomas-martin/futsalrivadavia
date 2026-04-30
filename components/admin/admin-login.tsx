"use client";

import { useState } from "react";
import Link from "next/link";

interface AdminLoginProps {
  onLogin: (user: string, pass: string) => boolean;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = onLogin(user.trim(), pass);
    if (!success) {
      setError(true);
      setPass("");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div
        className="w-full max-w-[400px] animate-fade-in-up rounded-[var(--radius-xl)] border-2 border-orange bg-surface p-10 shadow-[0_0_60px_rgba(255,107,0,0.2)]"
      >
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="text-3xl">&#9917;</span>
          <span className="font-[var(--font-condensed)] text-[1.4rem] font-black tracking-wide text-foreground">
            FUTSAL<span className="text-orange">RIVADAVIA</span>
          </span>
        </div>

        <h2 className="mb-1 text-center font-[var(--font-condensed)] text-[1.4rem] font-black uppercase tracking-widest text-foreground">
          Panel Administrador
        </h2>
        <p className="mb-6 text-center text-sm text-muted">
          Acceso restringido al personal autorizado.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="mb-1.5 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
              Usuario
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              className="w-full rounded-lg border border-foreground/10 bg-surface-alt px-4 py-3 text-foreground transition-all placeholder:text-muted focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange-glow"
            />
          </div>

          <div className="mb-5">
            <label className="mb-1.5 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
              Contrasena
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="********"
              autoComplete="current-password"
              className="w-full rounded-lg border border-foreground/10 bg-surface-alt px-4 py-3 text-foreground transition-all placeholder:text-muted focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange-glow"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[var(--radius)] border-2 border-orange bg-orange px-8 py-3 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-background transition-all hover:bg-orange-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          {error && (
            <div className="mt-4 rounded-lg border border-error/30 bg-error/15 px-4 py-3 text-center text-sm text-error">
              Credenciales incorrectas.
            </div>
          )}
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-muted transition-colors hover:text-orange"
        >
          ← Volver al sitio
        </Link>
      </div>
    </div>
  );
}
