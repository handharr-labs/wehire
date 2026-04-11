import { type FormFieldRepository } from '@/shared/domain/repositories/FormFieldRepository';

export interface DeleteFormFieldUseCase {
  execute(companyId: string, fieldId: string): Promise<void>;
}

export class DeleteFormFieldUseCaseImpl implements DeleteFormFieldUseCase {
  constructor(private readonly repository: FormFieldRepository) {}

  execute(companyId: string, fieldId: string): Promise<void> {
    return this.repository.delete(companyId, fieldId);
  }
}
