import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string; jobId: string }>;
}

export default async function ApplicationSuccessPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="bg-white rounded-lg border border-zinc-200 p-10">
          <div className="text-4xl mb-4">✓</div>
          <h1 className="text-xl font-bold text-zinc-900 mb-2">Application Submitted!</h1>
          <p className="text-zinc-500 text-sm mb-8">
            Thank you for applying. We&apos;ll review your application and reach out if there&apos;s a match.
          </p>
          <Link
            href={`/${slug}`}
            className="inline-block bg-zinc-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Back to Career Page
          </Link>
        </div>
      </div>
    </main>
  );
}
