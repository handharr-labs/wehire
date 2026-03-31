'use client';

import { useLoginFormViewModel } from './useLoginFormViewModel';

export function LoginFormView() {
  const vm = useLoginFormViewModel();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Login</h1>

        {vm.serverError && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {vm.serverError}
          </p>
        )}

        <form onSubmit={vm.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={vm.values.email}
              onChange={(e) => vm.setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {vm.fieldErrors?.email?._errors?.[0] && (
              <p className="mt-1 text-xs text-red-600">{vm.fieldErrors.email._errors[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={vm.values.password}
              onChange={(e) => vm.setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {vm.fieldErrors?.password?._errors?.[0] && (
              <p className="mt-1 text-xs text-red-600">{vm.fieldErrors.password._errors[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={vm.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
          >
            {vm.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
