import { type ApplicationPayload } from '../../domain/entities/ApplicationPayload';
import { type ApplicationRepository } from '../../domain/repositories/ApplicationRepository';
import { type AppsScriptDataSource } from '../data-sources/AppsScriptDataSource';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';

export class ApplicationRepositoryImpl implements ApplicationRepository {
  constructor(
    private readonly dataSource: AppsScriptDataSource,
    private readonly errorMapper: ErrorMapper,
  ) {}

  async submit(payload: ApplicationPayload): Promise<void> {
    try {
      await this.dataSource.submitApplication(payload);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }
}
