"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#club", label: "El Club" },
  { href: "#galeria", label: "Galeria" },
  { href: "#cuotas", label: "Cuotas" },
  { href: "#contacto", label: "Contacto" },
  { href: "#ubicacion", label: "Ubicacion" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b-2 border-orange transition-all duration-300 ${
        hasScrolled
          ? "bg-background/95 backdrop-blur-lg shadow-[0_4px_20px_rgba(255,107,0,0.15)]"
          : "bg-background/92 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-[70px] max-w-[1200px] items-center justify-between px-8">
        {/* Logo */}
        <Link href="#inicio" className="flex items-center gap-2.5">
          <Image
            src="/escudo.png"
            alt="Escudo Futsal Rivadavia"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="font-[var(--font-condensed)] text-[1.4rem] font-black tracking-wide text-foreground">
            FUTSAL<span className="text-orange">RIVADAVIA</span>
          </span>
        </Link>

        {/* Hamburger */}
        <button
          className="flex flex-col gap-[5px] border-none bg-transparent p-1 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <span
            className={`block h-0.5 w-[26px] rounded-sm bg-foreground transition-all ${
              isOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-[26px] rounded-sm bg-foreground transition-all ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-[26px] rounded-sm bg-foreground transition-all ${
              isOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>

        {/* Nav Links */}
        <ul
          className={`flex list-none items-center gap-1 ${
            isOpen
              ? "fixed top-[70px] right-0 left-0 flex flex-col gap-2 border-b-2 border-orange bg-background px-8 py-4 pb-8"
              : "hidden md:flex"
          }`}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={closeMenu}
                className="block rounded-[var(--radius-sm)] px-3.5 py-1.5 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-orange-glow hover:text-orange"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/admin"
              onClick={closeMenu}
              className="block rounded-[var(--radius-sm)] bg-orange px-3.5 py-1.5 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-background transition-all hover:bg-orange-light"
            >
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
