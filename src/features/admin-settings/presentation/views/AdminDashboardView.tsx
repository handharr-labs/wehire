'use client';

import { type Company } from '@/shared/domain/entities/Company';
import { CompanySelectorWidget } from '../organisms/CompanySelectorWidget';
import { useAdminDashboardViewModel } from './useAdminDashboardViewModel';

interface Props {
  companies: Company[];
  readonly?: boolean;
}

export function AdminDashboardView({ companies, readonly = false }: Props) {
  const vm = useAdminDashboardViewModel({ companies });

  return (
    <CompanySelectorWidget
      companies={companies}
      selectedId={vm.selectedId}
      onSelectionChange={vm.onSelectionChange}
      readonly={readonly}
      onGoToJobs={vm.onGoToJobs}
      onGoToSettings={vm.onGoToSettings}
    />
  );
}
