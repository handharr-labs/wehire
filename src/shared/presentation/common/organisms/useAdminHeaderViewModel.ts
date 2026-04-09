'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { logoutAdminAction } from '@/features/admin-auth/presentation/actions/logoutAdminAction';

export function useAdminHeaderViewModel() {
  const router = useRouter();
  const { execute, isPending } = useAction(logoutAdminAction, {
    onSuccess: ({ data }) => {
      if (data?.redirectTo) router.replace(data.redirectTo);
    },
  });

  return {
    onLogout: () => execute(),
    isPending,
  };
}
