import { CLUB_STATS } from "@/lib/types";

const stats = [
  { num: CLUB_STATS.fundado, label: "Fundado" },
  { num: CLUB_STATS.jugadores, label: "Jugadores" },
  { num: CLUB_STATS.titulos, label: "Titulos" },
  { num: CLUB_STATS.categorias, label: "Categorias" },
];

export function StatsBar() {
  return (
    <section className="bg-orange">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center px-8 py-6">
        {stats.map((stat, index) => (
          <div key={stat.label} className="flex items-center">
            <div className="flex flex-col items-center px-6 py-2 max-md:px-4">
              <span className="font-[var(--font-display)] text-[2.5rem] leading-none text-background">
                {stat.num}
              </span>
              <span className="font-[var(--font-condensed)] text-[0.75rem] font-bold uppercase tracking-widest text-background/60">
                {stat.label}
              </span>
            </div>
            {index < stats.length - 1 && (
              <div className="h-[50px] w-0.5 bg-background/20 max-md:h-[30px]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
