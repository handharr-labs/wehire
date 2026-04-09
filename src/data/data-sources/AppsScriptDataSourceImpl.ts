import { type HTTPClient } from '@/data/networking/HTTPClient';
import { type CompanyDTO } from '@/shared/data/dtos/CompanyDTO';
import { type UpdateCompanyDTO } from '@/data/dtos/UpdateCompanyDTO';
import { type JobDTO } from '@/shared/data/dtos/JobDTO';
import { type AppsScriptDataSource } from '@/data/data-sources/AppsScriptDataSource';

interface AppsScriptCompaniesResponse {
  data: CompanyDTO[];
}

interface AppsScriptCompanyResponse {
  data: CompanyDTO;
}

interface AppsScriptJobsResponse {
  data: JobDTO[];
}

interface AppsScriptJobResponse {
  data: JobDTO;
}

export class AppsScriptDataSourceImpl implements AppsScriptDataSource {
  constructor(private readonly httpClient: HTTPClient) {}

  async getCompanies(): Promise<CompanyDTO[]> {
    const response = await this.httpClient.get<AppsScriptCompaniesResponse>('', {
      params: { action: 'getCompanies' },
    });
    return response.data;
  }

  async getCompanyBySlug(slug: string): Promise<CompanyDTO> {
    const response = await this.httpClient.get<AppsScriptCompanyResponse>('', {
      params: { action: 'getCompany', slug },
    });
    return response.data;
  }

  async getCompanyById(companyId: string): Promise<CompanyDTO> {
    const response = await this.httpClient.get<AppsScriptCompanyResponse>('', {
      params: { action: 'getCompany', companyId },
    });
    return response.data;
  }

  async updateCompany(companyId: string, data: UpdateCompanyDTO): Promise<void> {
    await this.httpClient.post('', { action: 'updateCompany', companyId, ...data });
  }

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

  async getJobBySlug(jobId: string, slug: string): Promise<JobDTO> {
    const response = await this.httpClient.get<AppsScriptJobResponse>('', {
      params: { action: 'getJobBySlug', jobId, slug },
    });
    return response.data;
  }

  async submitApplication(formData: FormData): Promise<void> {
    await this.httpClient.post('', formData);
  }
}
