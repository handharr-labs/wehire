import { Skeleton } from '@/shared/presentation/common/atoms/Skeleton';

export default function CareerPageLoading() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="bg-zinc-300 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Skeleton className="h-12 w-32 mb-4 bg-zinc-400" />
          <Skeleton className="h-7 w-48 bg-zinc-400" />
          <Skeleton className="h-4 w-72 mt-2 bg-zinc-400" />
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <Skeleton className="h-6 w-36 mb-6" />
        <ul className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="bg-white rounded-lg border border-zinc-200 p-5">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
