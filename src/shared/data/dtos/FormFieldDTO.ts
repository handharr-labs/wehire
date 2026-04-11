export interface FormFieldDTO {
  id: string;
  label: string;
  field_name: string;
  type: string;
  required: boolean | string;
  options: string;
  sort_order: number | string;
  enabled: boolean | string;
  is_system: boolean | string;
}
