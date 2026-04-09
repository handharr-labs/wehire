import { HeroSection } from './organisms/HeroSection';
import { FeaturesSection } from './organisms/FeaturesSection';
import { BottomCtaSection } from './organisms/BottomCtaSection';
import { MarketingNavBar } from './molecules/MarketingNavBar';

export function MarketingLandingView() {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingNavBar />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <BottomCtaSection />
      </main>

      <footer className="text-zinc-400 text-sm text-center py-8">
        © 2025 WeHire · Handharr Labs
      </footer>
    </div>
  );
}
