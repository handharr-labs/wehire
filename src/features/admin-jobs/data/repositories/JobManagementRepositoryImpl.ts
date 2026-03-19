import { type Job } from '@/features/career-microsite/domain/entities/Job';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';
import {
  type IJobManagementRepository,
  type CreateJobInput,
  type UpdateJobInput,
} from '../../domain/repositories/IJobManagementRepository';
import { type JobManagementRemoteDataSource } from '../data-sources/JobManagementRemoteDataSource';
import { type IJobManagementMapper } from '../mappers/JobManagementMapper';

export class JobManagementRepositoryImpl implements IJobManagementRepository {
  constructor(
    private readonly dataSource: JobManagementRemoteDataSource,
    private readonly mapper: IJobManagementMapper,
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

  async create(input: CreateJobInput): Promise<{ id: string }> {
    try {
      const dto = this.mapper.toCreateDTO(input);
      const result = await this.dataSource.createJob(dto);
      return { id: result.id };
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async update(jobId: string, companyId: string, input: UpdateJobInput): Promise<void> {
    try {
      const dto = this.mapper.toUpdateDTO(input);
      await this.dataSource.updateJob(jobId, companyId, dto);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }

  async delete(jobId: string, companyId: string): Promise<void> {
    try {
      await this.dataSource.deleteJob(jobId, companyId);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }
}
