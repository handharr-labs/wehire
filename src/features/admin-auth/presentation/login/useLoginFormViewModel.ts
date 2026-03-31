'use client';

import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { loginAdminAction } from '../actions/loginAdminAction';
import { type LoginFormValues } from './loginFormSchema';

export function useLoginFormViewModel() {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });

  const { execute, result, isPending } = useAction(loginAdminAction, {
    onSuccess: () => {
      router.replace('/admin/dashboard');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    execute(values);
  }

  const fieldErrors = result.validationErrors as
    | { email?: { _errors?: string[] }; password?: { _errors?: string[] } }
    | undefined;

  function setEmail(v: string) {
    setValues((prev) => ({ ...prev, email: v }));
  }

  function setPassword(v: string) {
    setValues((prev) => ({ ...prev, password: v }));
  }

  return {
    values,
    setEmail,
    setPassword,
    isPending,
    serverError: result.serverError,
    fieldErrors,
    handleSubmit,
  };
}
