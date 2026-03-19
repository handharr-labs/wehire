'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Company } from '@/features/career-microsite/domain/entities/Company';

interface Props {
  companies: Company[];
}

export function CompanySelectorWidget({ companies }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(companies[0]?.id ?? '');

  function goToSettings() {
    if (selectedId) router.push(`/admin/settings?companyId=${selectedId}`);
  }

  return (
    <div className="flex gap-2 items-center">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        onClick={goToSettings}
        disabled={!selectedId}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
      >
        Settings
      </button>
    </div>
  );
}
