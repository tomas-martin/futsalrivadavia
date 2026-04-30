"use client";

// Demo gallery items - will be replaced with real photos from Supabase
const demoItems = [
  {
    id: "1",
    label: "Torneo Apertura 2024",
    className: "col-span-1 row-span-2 max-md:col-span-2 max-md:row-span-1",
    bgClass: "from-orange to-orange-dark",
  },
  {
    id: "2",
    label: "Entrenamiento",
    className: "",
    bgClass: "from-surface to-surface-alt",
  },
  {
    id: "3",
    label: "Copa Rivadavia",
    className: "",
    bgClass: "from-orange-dark to-orange",
  },
  {
    id: "4",
    label: "Campeones Juvenil",
    className: "",
    bgClass: "from-surface-alt to-orange",
  },
  {
    id: "5",
    label: "Final Liga Mendocina 2023",
    className: "col-span-2",
    bgClass: "from-orange to-surface",
  },
];

export function GaleriaSection() {
  return (
    <section id="galeria" className="bg-background">
      <div className="mx-auto max-w-[1100px] px-8 py-24">
        <div className="mb-2 font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-[0.25em] text-orange">
          GALERIA
        </div>
        <h2 className="mb-8 font-[var(--font-display)] text-[clamp(2.2rem,5vw,3.5rem)] leading-none text-foreground">
          Momentos <span className="text-orange">Inolvidables</span>
        </h2>

        <div className="grid grid-cols-3 grid-rows-[220px_220px] gap-3 max-md:grid-cols-1 max-md:grid-rows-none">
          {demoItems.map((item) => (
            <div
              key={item.id}
              className={`group relative cursor-pointer overflow-hidden rounded-[var(--radius)] bg-surface-alt ${item.className}`}
            >
              {/* Gradient background placeholder */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.bgClass} transition-transform duration-500 group-hover:scale-105`}
              />

              {/* Overlay */}
              <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-gradient-to-t from-background/80 to-transparent p-4 pt-12 transition-transform duration-300 group-hover:translate-y-0">
                <span className="font-[var(--font-condensed)] text-sm font-bold tracking-wide text-foreground">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Las fotos se cargan desde el panel de administracion.
        </p>
      </div>
    </section>
  );
}
