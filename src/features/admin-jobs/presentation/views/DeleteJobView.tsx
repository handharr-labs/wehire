'use client';

import { useDeleteJobViewModel } from './useDeleteJobViewModel';
import { DeleteJobDialog } from '../organisms/DeleteJobDialog';

interface Props {
  jobId: string;
  jobTitle: string;
  companyId: string;
}

export function DeleteJobView({ jobId, jobTitle, companyId }: Props) {
  const vm = useDeleteJobViewModel({ jobId, companyId });

  return (
    <DeleteJobDialog
      jobTitle={jobTitle}
      open={vm.open}
      isPending={vm.isPending}
      serverError={vm.serverError}
      onOpen={vm.openDialog}
      onClose={vm.closeDialog}
      onConfirm={vm.handleDelete}
    />
  );
}
