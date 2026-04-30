import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel Admin | Futsal Rivadavia",
  description: "Panel de administracion de Futsal Rivadavia",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
