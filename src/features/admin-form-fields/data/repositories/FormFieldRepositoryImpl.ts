import { type FormField } from '@/shared/domain/entities/FormField';
import { type FormFieldCreateInput, type FormFieldUpdateInput } from '@/shared/domain/entities/FormFieldInput';
import { type FormFieldRepository } from '@/shared/domain/repositories/FormFieldRepository';
import { type FormFieldRemoteDataSource } from '../data-sources/FormFieldRemoteDataSource';
import { type FormFieldMapper } from '../mappers/FormFieldMapper';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';

export class FormFieldRepositoryImpl implements FormFieldRepository {
  constructor(
    private readonly dataSource: FormFieldRemoteDataSource,
    private readonly mapper: FormFieldMapper,
    private readonly errorMapper: ErrorMapper,
  ) {}

  async getAll(companyId: string): Promise<FormField[]> {
    try {
      const dtos = await this.dataSource.getFormFields(companyId);
      return dtos.map((dto) => this.mapper.toDomain(dto));
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async create(companyId: string, input: FormFieldCreateInput): Promise<FormField> {
    try {
      const result = await this.dataSource.createFormField({
        companyId,
        label: input.label,
        type: input.type,
        required: input.required,
        options: input.options?.join(',') ?? '',
        sort_order: input.sortOrder,
      });
      // Re-fetch the created field by fetching all and finding by id
      const dtos = await this.dataSource.getFormFields(companyId);
      const dto = dtos.find((d) => d.id === result.id);
      if (!dto) throw new Error('Created field not found after creation');
      return this.mapper.toDomain(dto);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async update(companyId: string, fieldId: string, input: FormFieldUpdateInput): Promise<void> {
    try {
      await this.dataSource.updateFormField(companyId, fieldId, {
        label: input.label,
        type: input.type,
        required: input.required,
        options: input.options?.join(','),
        enabled: input.enabled,
      });
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async delete(companyId: string, fieldId: string): Promise<void> {
    try {
      await this.dataSource.deleteFormField(companyId, fieldId);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async reorder(companyId: string, order: Array<{ id: string; sortOrder: number }>): Promise<void> {
    try {
      await this.dataSource.reorderFormFields({
        companyId,
        order: order.map((o) => ({ id: o.id, sort_order: o.sortOrder })),
      });
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }
}
