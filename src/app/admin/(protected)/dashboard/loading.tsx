import { Skeleton } from '@/shared/presentation/common/atoms/Skeleton';

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <Skeleton className="h-7 w-40 mb-4" />
          <div className="flex gap-3 mb-4">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
