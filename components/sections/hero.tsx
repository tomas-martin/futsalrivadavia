export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden bg-background pt-[70px]"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 50%, rgba(255,107,0,0.12) 0%, transparent 60%),
            repeating-linear-gradient(
              -45deg,
              transparent, transparent 40px,
              rgba(255,107,0,0.03) 40px, rgba(255,107,0,0.03) 42px
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1100px] px-8 py-8">
        <div className="animate-fade-in-up mb-6 inline-block rounded-full border border-orange px-4 py-1.5 font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-[0.3em] text-orange">
          MENDOZA - ARGENTINA
        </div>

        <h1 className="animate-fade-in-up-delay-1 font-[var(--font-display)] text-[clamp(4rem,14vw,11rem)] leading-[0.85] text-foreground">
          FUTSAL
          <br />
          <span className="block text-orange">RIVADAVIA</span>
        </h1>

        <p className="animate-fade-in-up-delay-2 my-6 max-w-[520px] text-lg text-muted">
          Pasion, esfuerzo y compromiso en cada partido.
          <br />
          Somos mas que un equipo, somos una familia.
        </p>

        <div className="animate-fade-in-up-delay-3 flex flex-wrap gap-4">
          <a
            href="#cuotas"
            className="inline-flex items-center justify-center rounded-[var(--radius)] border-2 border-orange bg-orange px-8 py-3 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-background transition-all hover:-translate-y-0.5 hover:bg-orange-light hover:shadow-[var(--shadow-orange)]"
          >
            Pagar Cuota
          </a>
          <a
            href="#club"
            className="inline-flex items-center justify-center rounded-[var(--radius)] border-2 border-orange bg-transparent px-8 py-3 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-orange transition-all hover:bg-orange-glow"
          >
            Conoce el Club
          </a>
        </div>
      </div>

      {/* Floating ball */}
      <div
        className="animate-float pointer-events-none absolute -right-20 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full opacity-[0.18] max-md:hidden"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, var(--color-orange) 0%, var(--color-orange-dark) 50%, #330000 100%)",
        }}
      />
    </section>
  );
}
