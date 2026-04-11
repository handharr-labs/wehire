'use client';

import { type Company } from '@/shared/domain/entities/Company';

interface Props {
  companies: Company[];
  selectedId: string;
  onSelectionChange: (id: string) => void;
  readonly?: boolean;
  onGoToJobs: (companyId: string) => void;
  onGoToSettings: (companyId: string) => void;
  onGoToFormFields: (companyId: string) => void;
}

export function CompanySelectorWidget({ companies, selectedId, onSelectionChange, readonly = false, onGoToJobs, onGoToSettings, onGoToFormFields }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <select
        value={selectedId}
        onChange={(e) => onSelectionChange(e.target.value)}
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
        onClick={() => onGoToJobs(selectedId)}
        disabled={!selectedId}
        className="cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded px-4 py-2 transition-colors"
      >
        Manage Jobs
      </button>
      <button
        onClick={() => onGoToSettings(selectedId)}
        disabled={!selectedId}
        className="cursor-pointer bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 border border-gray-300 text-sm font-medium rounded px-4 py-2 transition-colors"
      >
        Settings
      </button>
      <button
        onClick={() => onGoToFormFields(selectedId)}
        disabled={!selectedId}
        className="cursor-pointer bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 border border-gray-300 text-sm font-medium rounded px-4 py-2 transition-colors"
      >
        Form Fields
      </button>
    </div>
  );
}
