import { Skeleton } from '@/shared/presentation/common/atoms/Skeleton';

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome header skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Company card skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <Skeleton className="h-1.5 w-full rounded-none" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-11 h-11 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1.5" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-11 w-full rounded-lg" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
