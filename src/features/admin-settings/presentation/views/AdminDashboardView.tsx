'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Company } from '@/features/career-microsite/domain/entities/Company';
import { CompanySelectorWidget } from '../organisms/CompanySelectorWidget';

interface Props {
  companies: Company[];
  readonly?: boolean;
}

export function AdminDashboardView({ companies, readonly = false }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(companies[0]?.id ?? '');

  return (
    <CompanySelectorWidget
      companies={companies}
      selectedId={selectedId}
      onSelectionChange={setSelectedId}
      readonly={readonly}
      onGoToJobs={(id) => router.push(`/admin/jobs?companyId=${id}`)}
      onGoToSettings={(id) => router.push(`/admin/settings?companyId=${id}`)}
    />
  );
}
