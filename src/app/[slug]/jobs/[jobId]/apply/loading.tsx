import { Skeleton } from '@/shared/presentation/common/atoms/Skeleton';

export default function ApplyFormLoading() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-56 mb-2" />
        <Skeleton className="h-4 w-32 mb-8" />

        <div className="bg-white rounded-lg border border-zinc-200 p-8 space-y-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-28 mb-1" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </main>
  );
}
