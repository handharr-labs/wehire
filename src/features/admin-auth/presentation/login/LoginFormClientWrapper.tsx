'use client';

import { useLoginFormViewModel } from './useLoginFormViewModel';
import { LoginFormView } from './LoginFormView';

export function LoginFormClientWrapper() {
  const vm = useLoginFormViewModel();
  return <LoginFormView vm={vm} />;
}
