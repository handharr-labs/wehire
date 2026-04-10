import { Skeleton } from '@/shared/presentation/common/atoms/Skeleton';

export default function AdminJobsLoading() {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-4 w-16 mb-4" />
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-24 rounded" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <th key={i} className="px-6 py-3">
                      <Skeleton className="h-3 w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
