import { type FormField } from '@/shared/domain/entities/FormField';
import { type FormFieldCreateInput } from '@/shared/domain/entities/FormFieldInput';
import { type FormFieldRepository } from '@/shared/domain/repositories/FormFieldRepository';

export interface CreateFormFieldUseCase {
  execute(companyId: string, input: FormFieldCreateInput): Promise<FormField>;
}

export class CreateFormFieldUseCaseImpl implements CreateFormFieldUseCase {
  constructor(private readonly repository: FormFieldRepository) {}

  execute(companyId: string, input: FormFieldCreateInput): Promise<FormField> {
    return this.repository.create(companyId, input);
  }
}
