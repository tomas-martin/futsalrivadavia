"use client";

import { useState } from "react";
import Link from "next/link";
import { MESES, AÑO_ACTUAL, type Jugador, type Pago } from "@/lib/types";

// Demo data - will be replaced with Supabase
const DEMO_JUGADORES: Jugador[] = [
  { dni: "38123456", nombre: "Lucas Perez", categoria: "Mayor", activo: true, email: "lucas@mail.com", telefono: "260412345" },
  { dni: "40234567", nombre: "Matias Gonzalez", categoria: "Juvenil", activo: true, email: "matias@mail.com", telefono: "260423456" },
  { dni: "42345678", nombre: "Tomas Rodriguez", categoria: "Mayor", activo: true, email: "tomas@mail.com", telefono: "260434567" },
  { dni: "35678901", nombre: "Federico Martinez", categoria: "Mayor", activo: true, email: "fede@mail.com", telefono: "260445678" },
  { dni: "43456789", nombre: "Ignacio Lopez", categoria: "Infantil", activo: true, email: "igna@mail.com", telefono: "260456789" },
];

const mesActual = new Date().getMonth();

const DEMO_PAGOS: Pago[] = [
  { id: "1", dni: "38123456", mes: 0, anio: AÑO_ACTUAL, estado: "aprobado", fecha: new Date().toISOString() },
  { id: "2", dni: "38123456", mes: 1, anio: AÑO_ACTUAL, estado: "aprobado", fecha: new Date().toISOString() },
  { id: "3", dni: "38123456", mes: 2, anio: AÑO_ACTUAL, estado: "aprobado", fecha: new Date().toISOString() },
  { id: "4", dni: "38123456", mes: 3, anio: AÑO_ACTUAL, estado: "aprobado", fecha: new Date().toISOString() },
  { id: "5", dni: "40234567", mes: 0, anio: AÑO_ACTUAL, estado: "aprobado", fecha: new Date().toISOString() },
  { id: "6", dni: "40234567", mes: 1, anio: AÑO_ACTUAL, estado: "aprobado", fecha: new Date().toISOString() },
  { id: "7", dni: "42345678", mes: 0, anio: AÑO_ACTUAL, estado: "aprobado", fecha: new Date().toISOString() },
  { id: "8", dni: "42345678", mes: 1, anio: AÑO_ACTUAL, estado: "aprobado", fecha: new Date().toISOString() },
  { id: "9", dni: "42345678", mes: 2, anio: AÑO_ACTUAL, estado: "aprobado", fecha: new Date().toISOString() },
  { id: "10", dni: "42345678", mes: 3, anio: AÑO_ACTUAL, estado: "en_revision", fecha: new Date().toISOString(), comentario: "Comprobante enviado" },
];

const DEMO_CONFIG = {
  cuota_valor: 3500,
  mp_alias: "futsal.rivadavia",
  mp_cvu: "0000003100099870123456",
};

type Tab = "dashboard" | "pagos" | "jugadores" | "config";

const tabTitles = {
  dashboard: "Dashboard",
  pagos: "Gestion de Pagos",
  jugadores: "Jugadores",
  config: "Configuracion",
};

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [jugadores] = useState(DEMO_JUGADORES);
  const [pagos, setPagos] = useState(DEMO_PAGOS);
  const [config, setConfig] = useState(DEMO_CONFIG);
  const [configSaved, setConfigSaved] = useState(false);

  // Stats
  const activeJugadores = jugadores.filter((j) => j.activo).length;
  const pendingPagos = pagos.filter((p) => p.estado === "en_revision").length;
  const approvedThisMonth = pagos.filter(
    (p) => p.estado === "aprobado" && p.mes === mesActual && p.anio === AÑO_ACTUAL
  ).length;
  const totalRevenue = approvedThisMonth * config.cuota_valor;

  const handleApprove = (id: string) => {
    setPagos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: "aprobado" as const } : p
      )
    );
  };

  const handleReject = (id: string) => {
    const reason = prompt("Motivo del rechazo (opcional):") || "";
    setPagos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, estado: "rechazado" as const, comentario_rechazo: reason }
          : p
      )
    );
  };

  const handleSaveConfig = () => {
    // TODO: Save to Supabase
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  const getStatusBadge = (estado: string) => {
    const styles: Record<string, string> = {
      aprobado: "bg-success/15 text-success border-success/25",
      en_revision: "bg-warning/15 text-warning border-warning/25",
      pendiente: "bg-orange/15 text-orange border-orange/25",
      rechazado: "bg-error/15 text-error border-error/25",
    };

    return (
      <span
        className={`inline-flex items-center rounded px-2.5 py-1 font-[var(--font-condensed)] text-[0.78rem] font-bold uppercase tracking-wide border ${styles[estado] || ""}`}
      >
        {estado === "aprobado" && "Aprobado"}
        {estado === "en_revision" && "En revision"}
        {estado === "rechazado" && "Rechazado"}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r-2 border-orange/20 bg-surface">
        <div className="flex items-center gap-2 border-b border-orange/15 px-6 py-6">
          <span className="text-2xl">&#9917;</span>
          <span className="font-[var(--font-condensed)] font-black tracking-wide text-foreground">
            FUTSAL<span className="text-orange">RIVADAVIA</span>
          </span>
        </div>

        <nav className="flex-1 p-3">
          {(["dashboard", "pagos", "jugadores", "config"] as Tab[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mb-1 flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-left font-[var(--font-condensed)] text-[0.95rem] font-bold tracking-wide transition-all ${
                  activeTab === tab
                    ? "bg-orange/12 text-orange"
                    : "text-muted hover:bg-orange/8 hover:text-foreground"
                }`}
              >
                {tab === "dashboard" && "Dashboard"}
                {tab === "pagos" && "Pagos"}
                {tab === "jugadores" && "Jugadores"}
                {tab === "config" && "Configuracion"}
              </button>
            )
          )}
        </nav>

        <div className="border-t border-orange/12 p-3">
          <Link
            href="/"
            className="mb-1 block px-4 py-2.5 font-[var(--font-condensed)] text-sm font-bold text-muted transition-colors hover:text-foreground"
          >
            Ver Sitio
          </Link>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2.5 text-left font-[var(--font-condensed)] text-sm font-bold text-error transition-colors hover:bg-error/10"
          >
            Salir
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="flex items-center justify-between border-b border-orange/12 px-8 py-6">
          <h1 className="font-[var(--font-display)] text-[2rem] tracking-wide text-foreground">
            {tabTitles[activeTab]}
          </h1>
          <div className="rounded-[var(--radius-sm)] border border-orange/20 bg-orange/10 px-4 py-1.5 font-[var(--font-condensed)] text-[0.85rem] font-bold tracking-widest text-orange">
            Administrador
          </div>
        </div>

        <div className="p-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              {/* Stats cards */}
              <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Jugadores activos",
                    value: activeJugadores,
                    sub: `${jugadores.length} en total`,
                  },
                  {
                    label: "Pagos en revision",
                    value: pendingPagos,
                    sub: "Requieren atencion",
                    color: pendingPagos > 0 ? "text-warning" : undefined,
                  },
                  {
                    label: `Pagos ${MESES[mesActual]}`,
                    value: approvedThisMonth,
                    sub: `de ${jugadores.length} jugadores`,
                  },
                  {
                    label: "Recaudado (mes)",
                    value: `$${(totalRevenue / 1000).toFixed(1)}k`,
                    sub: `${MESES[mesActual]} ${AÑO_ACTUAL}`,
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-[var(--radius)] border border-orange/15 bg-surface p-6 transition-all hover:-translate-y-1 hover:border-orange"
                  >
                    <div className="mb-1 font-[var(--font-condensed)] text-[0.75rem] font-bold uppercase tracking-[0.2em] text-muted">
                      {card.label}
                    </div>
                    <div
                      className={`font-[var(--font-display)] text-[2.8rem] leading-none ${card.color || "text-orange"}`}
                    >
                      {card.value}
                    </div>
                    <div className="mt-1 text-[0.8rem] text-muted">
                      {card.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending payments */}
              <div>
                <h3 className="mb-4 font-[var(--font-condensed)] text-[1.1rem] font-black uppercase tracking-widest text-orange">
                  Pagos Pendientes de Revision
                </h3>
                {pendingPagos === 0 ? (
                  <div className="rounded-[var(--radius)] bg-surface-alt p-12 text-center text-muted">
                    No hay pagos pendientes de revision.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-[var(--radius)]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface-alt">
                          <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                            Jugador
                          </th>
                          <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                            DNI
                          </th>
                          <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                            Mes
                          </th>
                          <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                            Estado
                          </th>
                          <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagos
                          .filter((p) => p.estado === "en_revision")
                          .map((pago) => {
                            const jug = jugadores.find(
                              (j) => j.dni === pago.dni
                            );
                            return (
                              <tr
                                key={pago.id}
                                className="border-b border-foreground/5 hover:bg-orange/5"
                              >
                                <td className="px-4 py-3">
                                  <strong className="text-foreground">
                                    {jug?.nombre || pago.dni}
                                  </strong>
                                  {jug?.categoria && (
                                    <span className="block text-xs text-muted">
                                      {jug.categoria}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <code className="text-orange">
                                    {pago.dni}
                                  </code>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                  {MESES[pago.mes]}
                                </td>
                                <td className="px-4 py-3">
                                  {getStatusBadge(pago.estado)}
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => handleApprove(pago.id)}
                                    className="mr-2 rounded p-1.5 text-muted transition-colors hover:bg-success/15 hover:text-success"
                                    title="Aprobar"
                                  >
                                    &#10003;
                                  </button>
                                  <button
                                    onClick={() => handleReject(pago.id)}
                                    className="rounded p-1.5 text-muted transition-colors hover:bg-error/15 hover:text-error"
                                    title="Rechazar"
                                  >
                                    &#10007;
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pagos */}
          {activeTab === "pagos" && (
            <div>
              <div className="overflow-x-auto rounded-[var(--radius)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-alt">
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        Jugador
                      </th>
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        DNI
                      </th>
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        Mes
                      </th>
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        Estado
                      </th>
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        Comentario
                      </th>
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map((pago) => {
                      const jug = jugadores.find((j) => j.dni === pago.dni);
                      return (
                        <tr
                          key={pago.id}
                          className="border-b border-foreground/5 hover:bg-orange/5"
                        >
                          <td className="px-4 py-3">
                            <strong className="text-foreground">
                              {jug?.nombre || pago.dni}
                            </strong>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-orange">{pago.dni}</code>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {MESES[pago.mes]}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(pago.estado)}
                          </td>
                          <td className="max-w-[120px] truncate px-4 py-3 text-sm text-muted">
                            {pago.comentario || "-"}
                          </td>
                          <td className="px-4 py-3">
                            {pago.estado === "en_revision" && (
                              <>
                                <button
                                  onClick={() => handleApprove(pago.id)}
                                  className="mr-2 rounded p-1.5 text-muted transition-colors hover:bg-success/15 hover:text-success"
                                  title="Aprobar"
                                >
                                  &#10003;
                                </button>
                                <button
                                  onClick={() => handleReject(pago.id)}
                                  className="rounded p-1.5 text-muted transition-colors hover:bg-error/15 hover:text-error"
                                  title="Rechazar"
                                >
                                  &#10007;
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Jugadores */}
          {activeTab === "jugadores" && (
            <div>
              <div className="overflow-x-auto rounded-[var(--radius)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-alt">
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        Nombre
                      </th>
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        DNI
                      </th>
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        Categoria
                      </th>
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        Estado
                      </th>
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        Email
                      </th>
                      <th className="border-b-2 border-orange/20 px-4 py-3 text-left font-[var(--font-condensed)] text-[0.8rem] font-bold uppercase tracking-widest text-orange">
                        Telefono
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jugadores.map((jug) => (
                      <tr
                        key={jug.dni}
                        className="border-b border-foreground/5 hover:bg-orange/5"
                      >
                        <td className="px-4 py-3">
                          <strong className="text-foreground">
                            {jug.nombre}
                          </strong>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-orange">{jug.dni}</code>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded border border-orange/25 bg-orange/15 px-2.5 py-1 font-[var(--font-condensed)] text-[0.78rem] font-bold uppercase tracking-wide text-orange">
                            {jug.categoria}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded border px-2.5 py-1 font-[var(--font-condensed)] text-[0.78rem] font-bold uppercase tracking-wide ${
                              jug.activo
                                ? "border-success/25 bg-success/15 text-success"
                                : "border-error/25 bg-error/15 text-error"
                            }`}
                          >
                            {jug.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted">
                          {jug.email || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted">
                          {jug.telefono || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Config */}
          {activeTab === "config" && (
            <div className="max-w-[500px]">
              <div className="rounded-[var(--radius-lg)] border border-orange/20 bg-surface p-8">
                <h3 className="mb-6 border-b-2 border-orange pb-3 font-[var(--font-condensed)] text-[1.3rem] font-black uppercase tracking-widest text-orange">
                  Configuracion General
                </h3>

                <div className="mb-5">
                  <label className="mb-1.5 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                    Valor Cuota Mensual ($)
                  </label>
                  <input
                    type="number"
                    value={config.cuota_valor}
                    onChange={(e) =>
                      setConfig({ ...config, cuota_valor: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-foreground/10 bg-surface-alt px-4 py-3 text-foreground transition-all placeholder:text-muted focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange-glow"
                  />
                </div>

                <div className="mb-5">
                  <label className="mb-1.5 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                    Alias Mercado Pago
                  </label>
                  <input
                    type="text"
                    value={config.mp_alias}
                    onChange={(e) =>
                      setConfig({ ...config, mp_alias: e.target.value })
                    }
                    className="w-full rounded-lg border border-foreground/10 bg-surface-alt px-4 py-3 text-foreground transition-all placeholder:text-muted focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange-glow"
                  />
                </div>

                <div className="mb-5">
                  <label className="mb-1.5 block font-[var(--font-condensed)] text-[0.85rem] font-bold uppercase tracking-widest text-orange">
                    CVU Mercado Pago
                  </label>
                  <input
                    type="text"
                    value={config.mp_cvu}
                    onChange={(e) =>
                      setConfig({ ...config, mp_cvu: e.target.value })
                    }
                    className="w-full rounded-lg border border-foreground/10 bg-surface-alt px-4 py-3 text-foreground transition-all placeholder:text-muted focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange-glow"
                  />
                </div>

                <button
                  onClick={handleSaveConfig}
                  className="w-full rounded-[var(--radius)] border-2 border-orange bg-orange px-8 py-3 font-[var(--font-condensed)] text-base font-bold uppercase tracking-widest text-background transition-all hover:bg-orange-light"
                >
                  Guardar Cambios
                </button>

                {configSaved && (
                  <div className="mt-4 rounded-lg border border-success/30 bg-success/15 px-4 py-3 text-sm text-success">
                    Configuracion guardada.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
