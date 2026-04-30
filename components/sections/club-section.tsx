import { CLUB_INFO } from "@/lib/types";

const valores = [
  {
    icon: "trophy",
    title: "Excelencia",
    description: "Buscamos el maximo nivel en cada entrenamiento y competencia.",
  },
  {
    icon: "handshake",
    title: "Companerismo",
    description: "El equipo es la fuerza que nos impulsa a ganar juntos.",
  },
  {
    icon: "heart",
    title: "Pasion",
    description: "Naranja y negro en el corazon, siempre.",
  },
];

function ValorIcon({ icon }: { icon: string }) {
  const icons = {
    trophy: (
      <svg
        className="h-8 w-8 text-orange"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 3h14M5 3a2 2 0 00-2 2v2a4 4 0 004 4h.5M5 3v8a8 8 0 008 8 8 8 0 008-8V5a2 2 0 00-2-2M19 3v8a4 4 0 01-4 4h-.5M12 19v2m-4 0h8"
        />
      </svg>
    ),
    handshake: (
      <svg
        className="h-8 w-8 text-orange"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 11l5-5 5 5M7 17l5-5 5 5"
        />
      </svg>
    ),
    heart: (
      <svg
        className="h-8 w-8 text-orange"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  };
  return icons[icon as keyof typeof icons] || null;
}

export function ClubSection() {
  return (
    <section id="club" className="bg-surface">
      <div className="mx-auto max-w-[1100px] px-8 py-24">
        <div className="mb-2 font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-[0.25em] text-orange">
          EL CLUB
        </div>
        <h2 className="mb-8 font-[var(--font-display)] text-[clamp(2.2rem,5vw,3.5rem)] leading-none text-foreground">
          Historia y <span className="text-orange">Valores</span>
        </h2>

        <div className="grid items-center gap-16 max-lg:grid-cols-1 lg:grid-cols-2">
          {/* Text content */}
          <div>
            <p className="mb-4 text-lg text-muted">
              Futsal Rivadavia nacio en 2015 con un sueno simple: crear un
              espacio donde el deporte, la amistad y el esfuerzo se encontraran.
              Con el tiempo, ese sueno crecio hasta convertirse en uno de los
              clubes mas queridos del departamento de Rivadavia, Mendoza.
            </p>
            <p className="mb-8 text-lg text-muted">
              Hoy contamos con tres categorias activas — Infantil, Juvenil y
              Mayor — y trabajamos dia a dia para que cada jugador tenga las
              mejores condiciones de entrenamiento y competencia.
            </p>

            {/* Valores */}
            <div className="grid gap-4 max-lg:grid-cols-1 lg:grid-cols-3">
              {valores.map((valor) => (
                <div
                  key={valor.title}
                  className="rounded-[var(--radius)] border border-orange/15 bg-surface-alt p-5 transition-all hover:-translate-y-1 hover:border-orange"
                >
                  <ValorIcon icon={valor.icon} />
                  <h4 className="mt-2 font-[var(--font-condensed)] text-base font-bold uppercase text-orange">
                    {valor.title}
                  </h4>
                  <p className="mt-1 text-sm text-muted">{valor.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div className="flex justify-center max-lg:hidden">
            <div className="relative w-[280px] overflow-hidden rounded-[var(--radius-xl)] border-2 border-orange bg-surface-alt p-10 text-center shadow-[var(--shadow-orange)]">
              {/* Accent */}
              <div
                className="absolute -right-[50px] -top-[50px] h-[150px] w-[150px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, var(--color-orange-glow), transparent)",
                }}
              />

              {/* Jersey */}
              <div className="my-4">
                <div
                  className="mx-auto flex h-[110px] w-[130px] flex-col items-center justify-center rounded-b-[20px] rounded-t-[10px] font-[var(--font-condensed)] font-black text-background"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-orange) 0%, var(--color-orange-dark) 100%)",
                    clipPath:
                      "polygon(15% 0%, 85% 0%, 100% 10%, 100% 100%, 0% 100%, 0% 10%)",
                  }}
                >
                  <span className="text-[0.75rem] tracking-widest">
                    RIVADAVIA
                  </span>
                  <span className="font-[var(--font-display)] text-[2.5rem] leading-none">
                    10
                  </span>
                </div>
              </div>

              <p className="mt-4 font-[var(--font-condensed)] text-[0.85rem] font-bold tracking-widest text-orange">
                &quot;{CLUB_INFO.moto}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
