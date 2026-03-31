interface Props {
  onLogout: () => void;
  isPending: boolean;
}

export function LogoutButton({ onLogout, isPending }: Props) {
  return (
    <button
      onClick={onLogout}
      disabled={isPending}
      className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors disabled:opacity-50"
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
