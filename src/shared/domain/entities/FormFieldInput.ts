import { type FormFieldType } from './FormField';

export interface FormFieldCreateInput {
  readonly label: string;
  readonly type: FormFieldType;
  readonly required: boolean;
  readonly options?: string[];
  readonly sortOrder?: number;
}

export interface FormFieldUpdateInput {
  readonly label?: string;
  readonly type?: FormFieldType;
  readonly required?: boolean;
  readonly options?: string[];
  readonly enabled?: boolean;
}
