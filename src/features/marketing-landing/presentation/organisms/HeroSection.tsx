export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#EEF0FF] to-[#FAFAFC]">
      <div className="max-w-3xl mx-auto px-4 py-28 text-center">
        <div className="inline-block bg-[#EEF0FF] text-[#4262FF] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          No Credit Card Required
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-[#1A1A2E] mb-6 leading-tight tracking-tight">
          Your brand. Your career page. In minutes.
        </h1>
        <p className="text-lg text-[#5E5E7A] mb-10 max-w-xl mx-auto leading-relaxed">
          WeHire gives small businesses in Indonesia a branded recruitment microsite — shareable, and free to start.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#request-access"
            className="inline-block bg-[#4262FF] hover:bg-[#3651E6] text-white rounded-xl px-7 py-3.5 font-semibold transition-colors"
          >
            Get Started Free
          </a>
          <a
            href="#features"
            className="inline-block bg-white border border-[#E8E8F0] text-[#1A1A2E] rounded-xl px-7 py-3.5 font-semibold hover:bg-[#FAFAFC] transition-colors"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
