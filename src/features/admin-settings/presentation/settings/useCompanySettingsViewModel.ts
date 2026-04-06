'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { type Company } from '@/shared/domain/entities/Company';
import { updateCompanySettingsAction } from '../actions/updateCompanySettingsAction';
import {
  companySettingsFormSchema,
  type CompanySettingsFormValues,
} from './companySettingsFormSchema';

interface Props {
  defaultValues: Company;
  companyId: string;
}

export function useCompanySettingsViewModel({ defaultValues, companyId }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsFormSchema),
    defaultValues: {
      name: defaultValues.name,
      logoUrl: defaultValues.logoUrl,
      primaryColor: defaultValues.primaryColor,
      secondaryColor: defaultValues.secondaryColor,
      description: defaultValues.description,
      contactEmail: defaultValues.contactEmail,
      whatsappNumber: defaultValues.whatsappNumber,
      siteStatus: defaultValues.siteStatus,
    },
  });

  const { execute, result, isPending } = useAction(updateCompanySettingsAction);

  const primaryColor = watch('primaryColor');
  const secondaryColor = watch('secondaryColor');

  function onSubmit(values: CompanySettingsFormValues) {
    execute({ ...values, companyId });
  }

  return {
    fields: {
      name: register('name'),
      logoUrl: register('logoUrl'),
      primaryColor: register('primaryColor'),
      secondaryColor: register('secondaryColor'),
      description: register('description'),
      contactEmail: register('contactEmail'),
      whatsappNumber: register('whatsappNumber'),
      siteStatus: register('siteStatus'),
    },
    fieldErrors: {
      name: errors.name?.message,
      logoUrl: errors.logoUrl?.message,
      primaryColor: errors.primaryColor?.message,
      secondaryColor: errors.secondaryColor?.message,
      description: errors.description?.message,
      contactEmail: errors.contactEmail?.message,
      whatsappNumber: errors.whatsappNumber?.message,
      siteStatus: errors.siteStatus?.message,
    },
    onFormSubmit: handleSubmit(onSubmit),
    isPending,
    saveError: result.serverError,
    saveSucceeded: result.data !== undefined && !result.serverError,
    primaryColor,
    secondaryColor,
    onPrimaryColorChange: (v: string) => setValue('primaryColor', v),
    onSecondaryColorChange: (v: string) => setValue('secondaryColor', v),
  };
}
