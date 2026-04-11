'use client';

import { type Company } from '@/shared/domain/entities/Company';
import { CompanySelectorWidget } from '../organisms/CompanySelectorWidget';

interface Props {
  companies: Company[];
}

export function AdminDashboardView({ companies }: Props) {
  return <CompanySelectorWidget companies={companies} />;
}
