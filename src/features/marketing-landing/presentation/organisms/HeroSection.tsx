export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-accent-subtle to-page">
      <div className="max-w-3xl mx-auto px-4 py-28 text-center">
        <div className="inline-block bg-accent-subtle text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          No Credit Card Required
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-ink mb-6 leading-tight tracking-tight">
          Your brand. Your career page. In minutes.
        </h1>
        <p className="text-lg text-ink-muted mb-10 max-w-xl mx-auto leading-relaxed">
          WeHire gives small businesses in Indonesia a branded recruitment microsite — shareable, and free to start.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#request-access"
            className="inline-block bg-accent hover:bg-accent-dim text-white rounded-xl px-7 py-3.5 font-semibold transition-colors"
          >
            Get Started Free
          </a>
          <a
            href="#features"
            className="inline-block bg-surface border border-stroke text-ink rounded-xl px-7 py-3.5 font-semibold hover:bg-page transition-colors"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
