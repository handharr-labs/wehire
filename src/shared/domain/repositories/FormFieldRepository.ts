import { type FormField } from '../entities/FormField';
import { type FormFieldCreateInput, type FormFieldUpdateInput } from '../entities/FormFieldInput';

export interface FormFieldRepository {
  getAll(companyId: string): Promise<FormField[]>;
  create(companyId: string, input: FormFieldCreateInput): Promise<FormField>;
  update(companyId: string, fieldId: string, input: FormFieldUpdateInput): Promise<void>;
  delete(companyId: string, fieldId: string): Promise<void>;
  reorder(companyId: string, order: Array<{ id: string; sortOrder: number }>): Promise<void>;
}
