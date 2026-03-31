import { type Job } from '../../domain/entities/Job';
import { type JobRepository } from '../../domain/repositories/JobRepository';
import { type AppsScriptDataSource } from '@/data/data-sources/AppsScriptDataSource';
import { type JobMapper } from '../mappers/JobMapper';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';

export class JobRepositoryImpl implements JobRepository {
  constructor(
    private readonly dataSource: AppsScriptDataSource,
    private readonly mapper: JobMapper,
    private readonly errorMapper: ErrorMapper,
  ) {}

  async getByCompanyId(companyId: string): Promise<Job[]> {
    try {
      const dtos = await this.dataSource.getJobsByCompanyId(companyId);
      return dtos.map((dto) => this.mapper.toDomain(dto));
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async getById(jobId: string, companyId: string): Promise<Job> {
    try {
      const dto = await this.dataSource.getJobById(jobId, companyId);
      return this.mapper.toDomain(dto);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async getByIdAndSlug(jobId: string, slug: string): Promise<Job> {
    try {
      const dto = await this.dataSource.getJobBySlug(jobId, slug);
      return this.mapper.toDomain(dto);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }
}
