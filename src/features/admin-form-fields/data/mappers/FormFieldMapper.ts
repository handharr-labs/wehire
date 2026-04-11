import { type FormField, type FormFieldType } from '@/shared/domain/entities/FormField';
import { type FormFieldDTO } from '@/shared/data/dtos/FormFieldDTO';

function toBool(value: boolean | string): boolean {
  return value === true || String(value).toLowerCase() === 'true';
}

export interface FormFieldMapper {
  toDomain(dto: FormFieldDTO): FormField;
}

export class FormFieldMapperImpl implements FormFieldMapper {
  toDomain(dto: FormFieldDTO): FormField {
    return {
      id: String(dto.id ?? ''),
      label: String(dto.label ?? ''),
      fieldName: String(dto.field_name ?? ''),
      type: (dto.type as FormFieldType) ?? 'text',
      required: toBool(dto.required),
      options: dto.options
        ? String(dto.options)
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean)
        : [],
      sortOrder: Number(dto.sort_order ?? 0),
      enabled: toBool(dto.enabled),
      isSystem: toBool(dto.is_system),
    };
  }
}
