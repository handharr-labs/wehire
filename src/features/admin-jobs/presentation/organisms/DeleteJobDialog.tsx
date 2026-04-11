interface Props {
  jobTitle: string;
  open: boolean;
  isPending: boolean;
  serverError: string | undefined;
  onOpen: () => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteJobDialog({ jobTitle, open, isPending, serverError, onOpen, onClose, onConfirm }: Props) {
  return (
    <>
      <button
        onClick={onOpen}
        className="cursor-pointer text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
      >
        Delete
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => !isPending && onClose()}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Job Posting</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-900">{jobTitle}</span>? This action cannot be
              undone.
            </p>

            {serverError && (
              <p className="mb-3 text-sm text-red-600">{serverError}</p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isPending}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
