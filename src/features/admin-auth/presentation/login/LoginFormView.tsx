'use client';

import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginAdminAction } from '../actions/loginAdminAction';
import type { LoginFormValues } from './loginFormSchema';

export function LoginFormView() {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });

  const { execute, result, isPending } = useAction(loginAdminAction, {
    onSuccess: ({ data }) => {
      if (data?.role === 'SUPER_ADMIN') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/dashboard');
      }
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    execute(values);
  }

  const fieldErrors = result.validationErrors as
    | { email?: { _errors?: string[] }; password?: { _errors?: string[] } }
    | undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Login</h1>

        {result.serverError && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {result.serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors?.email?._errors?.[0] && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email._errors[0]}</p>
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
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors?.password?._errors?.[0] && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.password._errors[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2 transition-colors"
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
