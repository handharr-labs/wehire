export function MarketingNavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
      <span className="font-bold text-zinc-900 text-lg">WeHire</span>
      <a
        href="#request-access"
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        Get Started
      </a>
    </nav>
  );
}
