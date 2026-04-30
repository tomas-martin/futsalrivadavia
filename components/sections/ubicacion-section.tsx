import { CLUB_INFO } from "@/lib/types";

export function UbicacionSection() {
  return (
    <section id="ubicacion" className="bg-background">
      <div className="mx-auto max-w-[1100px] px-8 py-24">
        <div className="mb-2 font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-[0.25em] text-orange">
          UBICACION
        </div>
        <h2 className="mb-8 font-[var(--font-display)] text-[clamp(2.2rem,5vw,3.5rem)] leading-none text-foreground">
          Donde <span className="text-orange">Entrenamos?</span>
        </h2>

        <div className="relative overflow-hidden rounded-[var(--radius-lg)] border-2 border-orange/20">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3365.123456!2d-68.4736!3d-33.1913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDExJzI4LjciUyA2OMKwMjgnMjUuMCJX!5e0!3m2!1ses!2sar!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0, filter: "grayscale(0.3) contrast(1.1)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicacion Futsal Rivadavia"
          />

          <div className="absolute bottom-6 left-6 rounded-[10px] border border-orange bg-background/92 px-5 py-4 text-sm leading-relaxed text-foreground backdrop-blur-sm">
            <strong>Estadio Municipal Rivadavia</strong>
            <br />
            {CLUB_INFO.ubicacion}
          </div>
        </div>
      </div>
    </section>
  );
}
