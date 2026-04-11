import { type FormFieldUpdateInput } from '@/shared/domain/entities/FormFieldInput';
import { type FormFieldRepository } from '@/shared/domain/repositories/FormFieldRepository';

export interface UpdateFormFieldUseCase {
  execute(companyId: string, fieldId: string, input: FormFieldUpdateInput): Promise<void>;
}

export class UpdateFormFieldUseCaseImpl implements UpdateFormFieldUseCase {
  constructor(private readonly repository: FormFieldRepository) {}

  execute(companyId: string, fieldId: string, input: FormFieldUpdateInput): Promise<void> {
    return this.repository.update(companyId, fieldId, input);
  }
}
