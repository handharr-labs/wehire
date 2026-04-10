import { Skeleton } from '@/shared/presentation/common/atoms/Skeleton';

export default function AdminSettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto px-8 pt-6 pb-10">
      <Skeleton className="h-4 w-16 mb-6" />
      <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-5">
        <Skeleton className="h-7 w-44 mb-2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-28 rounded" />
      </div>
    </div>
  );
}
