'use client';

import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { deleteJobAction } from './actions/deleteJobAction';

interface Props {
  jobId: string;
  companyId: string;
}

export function useDeleteJobViewModel({ jobId, companyId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { execute, result, isPending } = useAction(deleteJobAction, {
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  function handleDelete() {
    execute({ jobId, companyId });
  }

  return {
    open,
    openDialog: () => setOpen(true),
    closeDialog: () => setOpen(false),
    isPending,
    serverError: result.serverError,
    handleDelete,
  };
}
