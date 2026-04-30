import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-orange bg-surface px-8 py-8">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 max-md:flex-col max-md:text-center">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Image
            src="/escudo.png"
            alt="Escudo Futsal Rivadavia"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-[var(--font-condensed)] text-[1.1rem] font-black tracking-wide text-foreground">
            FUTSAL<span className="text-orange">RIVADAVIA</span>
          </span>
        </div>

        {/* Copyright */}
        <p className="text-[0.85rem] text-muted">
          &copy; {year} Futsal Rivadavia - Todos los derechos reservados -
          Rivadavia, Mendoza
        </p>

        {/* Admin link */}
        <Link
          href="/admin"
          className="rounded-[var(--radius-sm)] border border-orange px-4 py-1.5 font-[var(--font-condensed)] text-[0.85rem] font-bold tracking-widest text-orange transition-all hover:bg-orange-glow"
        >
          Panel Admin
        </Link>
      </div>
    </footer>
  );
}
