export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">WeHire</h1>
        <p className="text-zinc-500 text-lg mb-8">
          Branded recruitment microsites for small businesses in Indonesia.
        </p>
        <p className="text-zinc-400 text-sm">
          Visit <code className="bg-zinc-100 px-1 rounded">/{'{'}your-company{'}'}</code> to see your career page.
        </p>
      </div>
    </main>
  );
}
