import { type HTTPClient } from '@/data/networking/HTTPClient';
import { type FormFieldDTO } from '@/shared/data/dtos/FormFieldDTO';
import {
  type CreateFormFieldDTO,
  type UpdateFormFieldDTO,
  type ReorderFormFieldsDTO,
  type FormFieldWriteResultDTO,
} from '../dtos/FormFieldWriteDTO';

interface FormFieldsResponse {
  data: FormFieldDTO[];
}

interface FormFieldCreateResponse {
  data: FormFieldWriteResultDTO;
}

export interface FormFieldRemoteDataSource {
  getFormFields(companyId: string): Promise<FormFieldDTO[]>;
  createFormField(dto: CreateFormFieldDTO): Promise<FormFieldWriteResultDTO>;
  updateFormField(companyId: string, fieldId: string, dto: UpdateFormFieldDTO): Promise<void>;
  deleteFormField(companyId: string, fieldId: string): Promise<void>;
  reorderFormFields(dto: ReorderFormFieldsDTO): Promise<void>;
}

export class FormFieldRemoteDataSourceImpl implements FormFieldRemoteDataSource {
  constructor(
    private readonly httpClient: HTTPClient,
    private readonly adminSecret: string,
  ) {}

  async getFormFields(companyId: string): Promise<FormFieldDTO[]> {
    const response = await this.httpClient.get<FormFieldsResponse>('', {
      params: { action: 'getFormFields', companyId },
    });
    return response.data;
  }

  async createFormField(dto: CreateFormFieldDTO): Promise<FormFieldWriteResultDTO> {
    const response = await this.httpClient.post<FormFieldCreateResponse>('', {
      action: 'createFormField',
      secret: this.adminSecret,
      companyId: dto.companyId,
      label: dto.label,
      type: dto.type,
      required: dto.required,
      options: dto.options ?? '',
      sort_order: dto.sort_order,
    });
    return response.data;
  }

  async updateFormField(
    companyId: string,
    fieldId: string,
    dto: UpdateFormFieldDTO,
  ): Promise<void> {
    await this.httpClient.post('', {
      action: 'updateFormField',
      secret: this.adminSecret,
      companyId,
      fieldId,
      ...dto,
    });
  }

  async deleteFormField(companyId: string, fieldId: string): Promise<void> {
    await this.httpClient.post('', {
      action: 'deleteFormField',
      secret: this.adminSecret,
      companyId,
      fieldId,
    });
  }

  async reorderFormFields(dto: ReorderFormFieldsDTO): Promise<void> {
    await this.httpClient.post('', {
      action: 'reorderFormFields',
      secret: this.adminSecret,
      companyId: dto.companyId,
      order: dto.order,
    });
  }
}
