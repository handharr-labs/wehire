import { type Job } from '../../domain/entities/Job';
import { type JobRepository } from '../../domain/repositories/JobRepository';
import { type AppsScriptDataSource } from '../data-sources/AppsScriptDataSource';
import { JobMapper } from '../mappers/JobMapper';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';

export class JobRepositoryImpl implements JobRepository {
  constructor(
    private readonly dataSource: AppsScriptDataSource,
    private readonly errorMapper: ErrorMapper,
  ) {}

  async getByCompanyId(companyId: string): Promise<Job[]> {
    try {
      const dtos = await this.dataSource.getJobsByCompanyId(companyId);
      return dtos.map(JobMapper.toDomain);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async getById(jobId: string): Promise<Job> {
    try {
      const dto = await this.dataSource.getJobById(jobId);
      return JobMapper.toDomain(dto);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }
}
