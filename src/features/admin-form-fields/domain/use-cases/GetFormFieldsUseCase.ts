import { type FormField } from '@/shared/domain/entities/FormField';
import { type FormFieldRepository } from '@/shared/domain/repositories/FormFieldRepository';

export interface GetFormFieldsUseCase {
  execute(companyId: string): Promise<FormField[]>;
}

export class GetFormFieldsUseCaseImpl implements GetFormFieldsUseCase {
  constructor(private readonly repository: FormFieldRepository) {}

  execute(companyId: string): Promise<FormField[]> {
    return this.repository.getAll(companyId);
  }
}
