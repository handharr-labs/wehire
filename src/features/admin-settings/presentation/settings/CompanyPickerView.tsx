'use client';

import Link from 'next/link';
import { type Company } from '@/features/career-microsite/domain/entities/Company';

interface Props {
  companies: Company[];
}

export function CompanyPickerView({ companies }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Company Settings</h1>
          <p className="text-sm text-gray-500 mb-6">Select a company to configure.</p>

          <ul className="divide-y divide-gray-100">
            {companies.map((company) => (
              <li key={company.id}>
                <Link
                  href={`/admin/settings?companyId=${company.id}`}
                  className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{company.name}</p>
                    <p className="text-xs text-gray-500">{company.slug}</p>
                  </div>
                  <span className="text-xs text-gray-400">→</span>
                </Link>
              </li>
            ))}
          </ul>

          {companies.length === 0 && (
            <p className="text-sm text-gray-500">No companies found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
