import { type FormFieldRepository } from '@/shared/domain/repositories/FormFieldRepository';

export interface ReorderFormFieldsUseCase {
  execute(companyId: string, order: Array<{ id: string; sortOrder: number }>): Promise<void>;
}

export class ReorderFormFieldsUseCaseImpl implements ReorderFormFieldsUseCase {
  constructor(private readonly repository: FormFieldRepository) {}

  execute(companyId: string, order: Array<{ id: string; sortOrder: number }>): Promise<void> {
    return this.repository.reorder(companyId, order);
  }
}
