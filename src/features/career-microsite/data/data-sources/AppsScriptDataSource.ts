import { type HTTPClient } from '@/data/networking/HTTPClient';
import { type CompanyDTO } from '../dtos/CompanyDTO';
import { type UpdateCompanyDTO } from '../dtos/UpdateCompanyDTO';
import { type JobDTO } from '../dtos/JobDTO';
import { type ApplicationPayload } from '../../domain/entities/ApplicationPayload';

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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:application/pdf;base64,")
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export class AppsScriptDataSource {
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
    const cvBase64 = await fileToBase64(payload.cvFile);

    const formData = new FormData();
    formData.append('jobId', payload.jobId);
    formData.append('companyId', payload.companyId);
    formData.append('fullName', payload.fullName);
    formData.append('email', payload.email);
    formData.append('phone', payload.phone);
    formData.append('city', payload.city);
    formData.append('experienceSummary', payload.experienceSummary);
    formData.append('expectedSalary', String(payload.expectedSalary));
    formData.append('cvFile', cvBase64);
    formData.append('cvFileMime', payload.cvFile.type);
    formData.append('cvFileName', payload.cvFile.name);
    if (payload.linkedinUrl) formData.append('linkedinUrl', payload.linkedinUrl);
    if (payload.portfolioUrl) formData.append('portfolioUrl', payload.portfolioUrl);
    if (payload.coverLetter) formData.append('coverLetter', payload.coverLetter);

    await this.httpClient.post('', formData);
  }
}
