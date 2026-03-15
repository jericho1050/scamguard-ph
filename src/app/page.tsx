import { HeroSection } from "@/components/HeroSection";
import { ChatWidget } from "@/components/ChatWidget";
import { HowItWorks } from "@/components/HowItWorks";
import { ScamExamples } from "@/components/ScamExamples";
import { ImpactCounter } from "@/components/ImpactCounter";
import { AboutSection } from "@/components/AboutSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />

      <section className="px-4 py-12 max-w-lg mx-auto" id="chat">
        <ChatWidget />
      </section>

      <HowItWorks />
      <ScamExamples />
      <ImpactCounter />
      <AboutSection />

      <footer className="py-8 px-4 text-center border-t border-gray-100">
        <p className="text-sm text-gray-500">
          ScamGuard PH — AIRA Youth Challenge 2026
        </p>
        <p className="text-xs text-gray-400 mt-1">
          AI-powered scam detection for Filipino communities
        </p>
      </footer>
    </main>
  );
}
