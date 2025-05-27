import { Metadata } from "next";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Services from "@/components/Services/Services";
import InfiniteContentGrid from "@/components/InfiniteContentGrid/InfiniteContentGrid";
import NuestroEquipo from "@/components/ourTeam/ourTeam";

export const metadata: Metadata = {
  title: "Fosfenos Media",

  // other metadata
  description: "This is Home for Solid Pro"
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Brands />
      <InfiniteContentGrid />
      <NuestroEquipo />
      <Services />
    </main>
  );
}
