import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { ClubSection } from "@/components/sections/club-section";
import { GaleriaSection } from "@/components/sections/galeria-section";
import { CuotasSection } from "@/components/sections/cuotas-section";
import { ContactoSection } from "@/components/sections/contacto-section";
import { UbicacionSection } from "@/components/sections/ubicacion-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <ClubSection />
        <GaleriaSection />
        <CuotasSection />
        <ContactoSection />
        <UbicacionSection />
      </main>
      <Footer />
    </>
  );
}
