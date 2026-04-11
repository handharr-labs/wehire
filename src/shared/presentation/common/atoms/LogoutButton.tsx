interface Props {
  onLogout: () => void;
  isPending: boolean;
}

export function LogoutButton({ onLogout, isPending }: Props) {
  return (
    <button
      onClick={onLogout}
      disabled={isPending}
      title="Sign out"
      className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md px-2 py-1.5 hover:bg-red-50"
    >
      <svg
        className="w-3.5 h-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      <span>{isPending ? 'Signing out…' : 'Sign out'}</span>
    </button>
  );
}
