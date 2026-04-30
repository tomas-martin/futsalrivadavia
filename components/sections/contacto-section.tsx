"use client";

import { useState } from "react";
import { CLUB_INFO } from "@/lib/types";

const contactItems = [
  {
    icon: "location",
    title: "Direccion",
    value: CLUB_INFO.direccion,
  },
  {
    icon: "phone",
    title: "Telefono",
    value: CLUB_INFO.telefono,
  },
  {
    icon: "email",
    title: "Email",
    value: CLUB_INFO.email,
  },
  {
    icon: "clock",
    title: "Horarios de Entrenamiento",
    value: CLUB_INFO.horarios,
  },
];

function ContactIcon({ icon }: { icon: string }) {
  const icons = {
    location: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    phone: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    email: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    clock: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };
  return icons[icon as keyof typeof icons] || null;
}

export function ContactoSection() {
  const [formState, setFormState] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Integrate with Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSuccess(true);
    setFormState({ nombre: "", email: "", mensaje: "" });
    setLoading(false);

    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <section id="contacto" className="bg-surface">
      <div className="mx-auto max-w-[1100px] px-8 py-24">
        <div className="mb-2 font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-[0.25em] text-orange">
          CONTACTO
        </div>
        <h2 className="mb-8 font-[var(--font-display)] text-[clamp(2.2rem,5vw,3.5rem)] leading-none text-foreground">
          Hablemos <span className="text-orange">con Nosotros</span>
        </h2>

        <div className="grid items-start gap-16 max-lg:grid-cols-1 lg:grid-cols-2">
          {/* Contact info */}
          <div>
            {contactItems.map((item) => (
              <div key={item.title} className="mb-6 flex items-start gap-4">
                <span className="mt-0.5 shrink-0 text-orange">
                  <ContactIcon icon={item.icon} />
                </span>
                <div>
                  <h4 className="mb-0.5 font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                    {item.title}
                  </h4>
                  <p className="text-[0.95rem] text-muted">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={CLUB_INFO.facebook}
                className="rounded-lg border border-orange/25 bg-surface-alt px-4 py-2 font-[var(--font-condensed)] text-[0.85rem] font-bold text-foreground transition-all hover:border-orange hover:text-orange"
              >
                Facebook
              </a>
              <a
                href={CLUB_INFO.instagram}
                className="rounded-lg border border-orange/25 bg-surface-alt px-4 py-2 font-[var(--font-condensed)] text-[0.85rem] font-bold text-foreground transition-all hover:border-orange hover:text-orange"
              >
                Instagram
              </a>
              <a
                href={CLUB_INFO.whatsapp}
                className="rounded-lg border border-orange/25 bg-surface-alt px-4 py-2 font-[var(--font-condensed)] text-[0.85rem] font-bold text-foreground transition-all hover:border-orange hover:text-orange"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-[var(--radius-lg)] border border-orange/20 bg-background p-8 shadow-[var(--shadow-base)]">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="mb-1.5 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formState.nombre}
                  onChange={(e) =>
                    setFormState({ ...formState, nombre: e.target.value })
                  }
                  placeholder="Tu nombre completo"
                  required
                  className="w-full rounded-lg border border-foreground/10 bg-surface px-4 py-3 text-foreground transition-all placeholder:text-muted focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange-glow"
                />
              </div>

              <div className="mb-5">
                <label className="mb-1.5 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                  Email
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  placeholder="tu@email.com"
                  required
                  className="w-full rounded-lg border border-foreground/10 bg-surface px-4 py-3 text-foreground transition-all placeholder:text-muted focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange-glow"
                />
              </div>

              <div className="mb-5">
                <label className="mb-1.5 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                  Mensaje
                </label>
                <textarea
                  value={formState.mensaje}
                  onChange={(e) =>
                    setFormState({ ...formState, mensaje: e.target.value })
                  }
                  rows={4}
                  placeholder="Contanos en que podemos ayudarte..."
                  required
                  className="w-full resize-y rounded-lg border border-foreground/10 bg-surface px-4 py-3 text-foreground transition-all placeholder:text-muted focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange-glow"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[var(--radius)] border-2 border-orange bg-orange px-8 py-3 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-background transition-all hover:bg-orange-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar Mensaje"}
              </button>

              {success && (
                <div className="mt-4 rounded-lg border border-success/30 bg-success/15 px-4 py-3 text-sm text-success">
                  Mensaje enviado. Te respondemos pronto!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
