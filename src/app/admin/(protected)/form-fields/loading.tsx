import { Skeleton } from '@/shared/presentation/common/atoms/Skeleton';

export default function AdminFormFieldsLoading() {
  return (
    <div className="max-w-2xl mx-auto px-8 pt-6 pb-10">
      <Skeleton className="h-4 w-16 mb-6" />
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <Skeleton className="h-7 w-56 mb-2" />
        <Skeleton className="h-4 w-72 mb-6" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-lg mt-2" />
      </div>
    </div>
  );
}
