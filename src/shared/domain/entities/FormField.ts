export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'url'
  | 'number'
  | 'date'
  | 'select'
  | 'file';

export interface FormField {
  readonly id: string;
  readonly label: string;
  /** snake_case key; matches column header in Candidates sheet */
  readonly fieldName: string;
  readonly type: FormFieldType;
  readonly required: boolean;
  /** Non-empty only for 'select' type */
  readonly options: string[];
  readonly sortOrder: number;
  readonly enabled: boolean;
  /**
   * true for the 10 built-in fields.
   * System fields cannot be deleted; the 7 core ones cannot be disabled.
   */
  readonly isSystem: boolean;
}
