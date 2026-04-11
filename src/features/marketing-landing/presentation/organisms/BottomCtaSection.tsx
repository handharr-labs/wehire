export function BottomCtaSection() {
  return (
    <section id="request-access" className="bg-page py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-accent to-accent-alt rounded-2xl px-10 py-16 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Ready to launch your career page?</h2>
          <p className="text-white/75 mb-10 max-w-md mx-auto leading-relaxed">
            Request early access — we&apos;ll set up your microsite and onboard you personally.
          </p>
          <a
            href="mailto:hello@wehire.id"
            className="inline-block bg-surface text-accent rounded-xl px-7 py-3.5 font-semibold hover:bg-accent-subtle transition-colors"
          >
            Request Access
          </a>
        </div>
      </div>
    </section>
  );
}
