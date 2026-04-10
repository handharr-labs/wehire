import { Skeleton } from '@/shared/presentation/common/atoms/Skeleton';

export default function JobDetailLoading() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Skeleton className="h-4 w-32 mb-6" />

        <div className="bg-white rounded-lg border border-zinc-200 p-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80 mt-1" />
          <Skeleton className="h-4 w-32 mt-2" />

          <hr className="my-6 border-zinc-100" />

          <section>
            <Skeleton className="h-5 w-36 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </section>

          <section className="mt-6">
            <Skeleton className="h-5 w-28 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </section>

          <div className="mt-8">
            <Skeleton className="h-11 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}
