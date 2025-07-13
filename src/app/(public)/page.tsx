"use client";
import FeaturesSection from "@/src/section/landing/features.section";
import HeroSection from "@/src/section/landing/hero.section";

export default function Home() {
  return (
    <div className="bg-slate-950 py-9">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
