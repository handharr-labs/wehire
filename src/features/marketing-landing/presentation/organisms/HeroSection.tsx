export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4 sm:text-5xl">
          Your brand. Your career page. In minutes.
        </h1>
        <p className="text-lg text-zinc-500 mb-8">
          WeHire gives small businesses in Indonesia a branded recruitment microsite — shareable, and free to start.
        </p>
        <a
          href="#request-access"
          className="inline-block bg-indigo-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-indigo-700 transition-colors"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}
