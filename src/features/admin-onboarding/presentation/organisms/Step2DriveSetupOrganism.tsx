'use client';

interface Props {
  slug: string;
  onContinue: () => void;
}

export function Step2DriveSetupOrganism({ slug, onContinue }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Set Up Google Drive</h2>
      <p className="text-sm text-gray-500 mb-5">
        Please complete the following steps in Google Drive before continuing.
      </p>

      <ul className="space-y-3 mb-6">
        <ChecklistItem>
          Create a folder named{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">{slug}-dir</code>{' '}
          inside the root Drive folder.
        </ChecklistItem>
        <ChecklistItem>
          Inside that folder, create a Google Sheet named{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">
            {slug}-database
          </code>
          .
        </ChecklistItem>
        <ChecklistItem>
          Add the following tabs to the sheet:{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">Jobs</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">Candidates</code>,{' '}
          <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">Form_Logs</code>.
        </ChecklistItem>
      </ul>

      <button
        onClick={onContinue}
        className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        I&apos;ve completed setup →
      </button>
    </div>
  );
}

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-gray-700">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border border-gray-300 bg-gray-50 text-gray-400">
        &#9633;
      </span>
      <span>{children}</span>
    </li>
  );
}
