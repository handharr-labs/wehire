import { HeroSection } from './organisms/HeroSection';
import { FeaturesSection } from './organisms/FeaturesSection';
import { BottomCtaSection } from './organisms/BottomCtaSection';

export function MarketingLandingView() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
        <span className="font-bold text-zinc-900 text-lg">WeHire</span>
        <a
          href="#request-access"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Get Started
        </a>
      </nav>

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
