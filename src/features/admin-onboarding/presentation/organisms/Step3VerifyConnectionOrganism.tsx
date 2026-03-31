'use client';

interface Props {
  slug: string;
  verifySuccess: boolean;
  isPending: boolean;
  serverError: string | undefined;
  onVerify: () => void;
  onContinue: () => void;
}

const primaryButtonClass =
  'rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors';

export function Step3VerifyConnectionOrganism({
  slug,
  verifySuccess,
  isPending,
  serverError,
  onVerify,
  onContinue,
}: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Verify Connection</h2>
      <p className="text-sm text-gray-500 mb-5">
        We&apos;ll check that your Google Drive structure is accessible. Your slug:{' '}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">{slug}</code>
      </p>

      {serverError && !verifySuccess && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {verifySuccess && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Connection verified successfully.
        </div>
      )}

      {!verifySuccess ? (
        <button onClick={onVerify} disabled={isPending} className={primaryButtonClass}>
          {isPending ? 'Verifying...' : 'Verify Connection'}
        </button>
      ) : (
        <button onClick={onContinue} className={primaryButtonClass}>
          Continue →
        </button>
      )}

      {serverError && !verifySuccess && (
        <button
          onClick={onVerify}
          disabled={isPending}
          className="mt-2 ml-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
