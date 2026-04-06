import { type CompanyDTO } from '@/data/dtos/CompanyDTO';
import { type UpdateCompanyDTO } from '@/data/dtos/UpdateCompanyDTO';
import { type JobDTO } from '@/data/dtos/JobDTO';
export interface AppsScriptDataSource {
  getCompanies(): Promise<CompanyDTO[]>;
  getCompanyBySlug(slug: string): Promise<CompanyDTO>;
  getCompanyById(companyId: string): Promise<CompanyDTO>;
  updateCompany(companyId: string, data: UpdateCompanyDTO): Promise<void>;
  getJobsByCompanyId(companyId: string): Promise<JobDTO[]>;
  getJobById(jobId: string, companyId: string): Promise<JobDTO>;
  getJobBySlug(jobId: string, slug: string): Promise<JobDTO>;
  submitApplication(formData: FormData): Promise<void>;
}
