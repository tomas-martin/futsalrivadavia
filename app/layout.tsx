import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const barlow = Barlow({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-condensed",
});

export const metadata: Metadata = {
  title: "Futsal Rivadavia | Club de Futsal en Mendoza, Argentina",
  description:
    "Futsal Rivadavia - Club de futbol sala en Rivadavia, Mendoza. Pasion, esfuerzo y compromiso en cada partido. Categorias Mayor, Juvenil e Infantil.",
  keywords: [
    "futsal",
    "rivadavia",
    "mendoza",
    "argentina",
    "futbol sala",
    "deportes",
    "club deportivo",
  ],
  authors: [{ name: "Futsal Rivadavia" }],
  openGraph: {
    title: "Futsal Rivadavia",
    description: "Club de Futsal en Rivadavia, Mendoza, Argentina",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B00",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${barlow.variable} ${barlowCondensed.variable} bg-background`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
