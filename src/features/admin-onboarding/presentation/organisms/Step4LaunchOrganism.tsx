'use client';

interface Props {
  slug: string;
  isPending: boolean;
  serverError: string | undefined;
  onLaunch: () => void;
}

const primaryButtonClass =
  'rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors';

export function Step4LaunchOrganism({ slug, isPending, serverError, onLaunch }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Ready to Launch</h2>
      <p className="text-sm text-gray-500 mb-5">Your career page is ready to go live.</p>

      <div className="mb-5 rounded-lg bg-gray-50 border border-gray-200 p-4">
        <p className="text-sm text-gray-700">
          Career page slug:{' '}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs font-mono border border-gray-200">
            {slug}
          </code>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Clicking Launch will activate your career page and redirect you to the jobs dashboard.
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <button onClick={onLaunch} disabled={isPending} className={primaryButtonClass}>
        {isPending ? 'Launching...' : 'Launch Career Page'}
      </button>
    </div>
  );
}
