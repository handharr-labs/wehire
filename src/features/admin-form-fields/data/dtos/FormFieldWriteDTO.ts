export interface CreateFormFieldDTO {
  companyId: string;
  label: string;
  type: string;
  required: boolean;
  options?: string;
  sort_order?: number;
}

export interface UpdateFormFieldDTO {
  label?: string;
  type?: string;
  required?: boolean;
  options?: string;
  enabled?: boolean;
}

export interface ReorderFormFieldsDTO {
  companyId: string;
  order: Array<{ id: string; sort_order: number }>;
}

export interface FormFieldWriteResultDTO {
  id: string;
  field_name: string;
}
