import { type HTTPClient } from '@/data/networking/HTTPClient';
import { type CompanyDTO } from '../dtos/CompanyDTO';
import { type JobDTO } from '../dtos/JobDTO';
import { type ApplicationPayload } from '../../domain/entities/ApplicationPayload';

interface AppsScriptCompanyResponse {
  data: CompanyDTO;
}

interface AppsScriptJobsResponse {
  data: JobDTO[];
}

interface AppsScriptJobResponse {
  data: JobDTO;
}

export class AppsScriptDataSource {
  constructor(private readonly httpClient: HTTPClient) {}

  async getCompanyBySlug(slug: string): Promise<CompanyDTO> {
    const response = await this.httpClient.get<AppsScriptCompanyResponse>('', {
      params: { action: 'getCompany', slug },
    });
    return response.data;
  }

  async getJobsByCompanyId(companyId: string): Promise<JobDTO[]> {
    const response = await this.httpClient.get<AppsScriptJobsResponse>('', {
      params: { action: 'getJobs', companyId },
    });
    return response.data;
  }

  async getJobById(jobId: string): Promise<JobDTO> {
    const response = await this.httpClient.get<AppsScriptJobResponse>('', {
      params: { action: 'getJob', jobId },
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
    formData.append('cvFile', payload.cvFile);
    if (payload.linkedinUrl) formData.append('linkedinUrl', payload.linkedinUrl);
    if (payload.portfolioUrl) formData.append('portfolioUrl', payload.portfolioUrl);
    if (payload.coverLetter) formData.append('coverLetter', payload.coverLetter);

    await this.httpClient.post('', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}
