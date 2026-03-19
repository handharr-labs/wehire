'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Company } from '@/features/career-microsite/domain/entities/Company';

interface Props {
  companies: Company[];
  readonly?: boolean;
}

export function CompanySelectorWidget({ companies, readonly = false }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(companies[0]?.id ?? '');

  function goToSettings() {
    if (selectedId) router.push(`/admin/settings?companyId=${selectedId}`);
  }

  function goToJobs() {
    if (selectedId) router.push(`/admin/jobs?companyId=${selectedId}`);
  }

  return (
    <div className="flex gap-2 items-center">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        disabled={readonly}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        onClick={goToJobs}
        disabled={!selectedId}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
      >
        Manage Jobs
      </button>
      <button
        onClick={goToSettings}
        disabled={!selectedId}
        className="bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-700 border border-gray-300 text-sm font-medium rounded px-4 py-2 transition-colors"
      >
        Settings
      </button>
    </div>
  );
}
