import Link from 'next/link';

export function MarketingNavBar() {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur border-b border-[#E8E8F0]">
      <span className="font-bold text-[#1A1A2E] text-lg tracking-tight">WeHire</span>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/login"
          className="text-sm font-medium text-[#5E5E7A] hover:text-[#1A1A2E] transition-colors"
        >
          Login
        </Link>
        <a
          href="#request-access"
          className="text-sm font-semibold bg-[#4262FF] hover:bg-[#3651E6] text-white px-4 py-2 rounded-xl transition-colors"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}
