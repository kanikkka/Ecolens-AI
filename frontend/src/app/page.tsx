import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { Journey } from "@/components/home/journey";
import { Features } from "@/components/home/features";
import { ImpactCTA } from "@/components/home/impact-cta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <Features />
        <ImpactCTA />
      </main>
      <Footer />
    </>
  );
}
