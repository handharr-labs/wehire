import { type HTTPClient } from '@/data/networking/HTTPClient';
import { type CompanyDTO } from '@/data/dtos/CompanyDTO';
import { type UpdateCompanyDTO } from '@/data/dtos/UpdateCompanyDTO';
import { type JobDTO } from '@/data/dtos/JobDTO';
import { type ApplicationPayload } from '@/shared/domain/entities/ApplicationPayload';
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

  async submitApplication(payload: ApplicationPayload): Promise<void> {
    const formData = new FormData();
    formData.append('jobId', payload.jobId);
    formData.append('companyId', payload.companyId);
    formData.append('fullName', payload.fullName);
    formData.append('email', payload.email);
    formData.append('phone', payload.phone);
    formData.append('city', payload.city);
    formData.append('experienceSummary', payload.experienceSummary);
    formData.append('expectedSalary', String(payload.expectedSalary));
    formData.append('cvFile', payload.cvBase64);
    formData.append('cvFileMime', payload.cvFileMime);
    formData.append('cvFileName', payload.cvFileName);
    if (payload.linkedinUrl) formData.append('linkedinUrl', payload.linkedinUrl);
    if (payload.portfolioUrl) formData.append('portfolioUrl', payload.portfolioUrl);
    if (payload.coverLetter) formData.append('coverLetter', payload.coverLetter);

    await this.httpClient.post('', formData);
  }
}
