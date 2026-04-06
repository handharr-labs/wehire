'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Company } from '@/shared/domain/entities/Company';

interface Props {
  companies: Company[];
}

export function useAdminDashboardViewModel({ companies }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(companies[0]?.id ?? '');

  return {
    selectedId,
    onSelectionChange: setSelectedId,
    onGoToJobs: (id: string) => router.push(`/admin/jobs?companyId=${id}`),
    onGoToSettings: (id: string) => router.push(`/admin/settings?companyId=${id}`),
  };
}
