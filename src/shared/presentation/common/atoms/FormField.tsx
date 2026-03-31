interface Props {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, children }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
