import { type HTTPClient } from '@/data/networking/HTTPClient';
import { type JobDTO } from '@/features/career-microsite/data/dtos/JobDTO';
import { type CreateJobDTO, type UpdateJobDTO, type JobWriteResultDTO } from '../dtos/JobWriteDTO';

interface AppsScriptJobsResponse {
  data: JobDTO[];
}

interface AppsScriptJobResponse {
  data: JobDTO;
}

interface AppsScriptCreateJobResponse {
  data: JobWriteResultDTO;
}

export interface JobManagementRemoteDataSource {
  getJobsByCompanyId(companyId: string): Promise<JobDTO[]>;
  getJobById(jobId: string, companyId: string): Promise<JobDTO>;
  createJob(dto: CreateJobDTO): Promise<JobWriteResultDTO>;
  updateJob(jobId: string, companyId: string, dto: UpdateJobDTO): Promise<void>;
  deleteJob(jobId: string, companyId: string): Promise<void>;
}

export class JobManagementRemoteDataSourceImpl implements JobManagementRemoteDataSource {
  constructor(
    private readonly httpClient: HTTPClient,
    private readonly adminSecret: string,
  ) {}

  async getJobsByCompanyId(companyId: string): Promise<JobDTO[]> {
    const response = await this.httpClient.get<AppsScriptJobsResponse>('', {
      params: { action: 'getJobs', companyId },
    });
    return response.data;
  }

  async getJobById(jobId: string, companyId: string): Promise<JobDTO> {
    const response = await this.httpClient.get<AppsScriptJobResponse>('', {
      params: { action: 'getJob', jobId, companyId },
    });
    return response.data;
  }

  async createJob(dto: CreateJobDTO): Promise<JobWriteResultDTO> {
    const response = await this.httpClient.post<AppsScriptCreateJobResponse>('', {
      action: 'createJob',
      secret: this.adminSecret,
      companyId: dto.companyId,
      title: dto.title,
      department: dto.department,
      location: dto.location,
      employment_type: dto.employment_type,
      min_salary: dto.min_salary,
      max_salary: dto.max_salary,
      description: dto.description,
      requirements: dto.requirements,
      status: dto.status,
      expired_at: dto.expired_at,
      sort_order: dto.sort_order,
    });
    return response.data;
  }

  async updateJob(jobId: string, companyId: string, dto: UpdateJobDTO): Promise<void> {
    await this.httpClient.post('', {
      action: 'updateJob',
      secret: this.adminSecret,
      jobId,
      companyId,
      ...dto,
    });
  }

  async deleteJob(jobId: string, companyId: string): Promise<void> {
    await this.httpClient.post('', {
      action: 'deleteJob',
      secret: this.adminSecret,
      jobId,
      companyId,
    });
  }
}
