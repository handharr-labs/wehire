import 'server-only';

import { createUnauthenticatedHTTPClient } from '@/data/networking/AxiosHTTPClient';
import { ErrorMapperImpl } from '@/data/mappers/ErrorMapper';
import { AppsScriptDataSource } from '@/features/career-microsite/data/data-sources/AppsScriptDataSource';
import { CompanyRepositoryImpl } from '@/features/career-microsite/data/repositories/CompanyRepositoryImpl';
import { JobRepositoryImpl } from '@/features/career-microsite/data/repositories/JobRepositoryImpl';
import { GetCompanyBySlugUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetCompanyBySlugUseCase';
import { GetJobsUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetJobsUseCase';
import { GetJobDetailUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetJobDetailUseCase';
import { GetJobDetailBySlugUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetJobDetailBySlugUseCase';
import { AdminDataSource } from '@/features/admin-auth/data/data-sources/AdminDataSource';
import { BcryptPasswordVerifier } from '@/features/admin-auth/data/services/BcryptPasswordVerifier';
import { AdminRepositoryImpl } from '@/features/admin-auth/data/repositories/AdminRepositoryImpl';
import { LoginAdminUseCaseImpl } from '@/features/admin-auth/domain/use-cases/LoginAdminUseCase';
import { CompanySettingsRepositoryImpl } from '@/features/admin-settings/data/repositories/CompanySettingsRepositoryImpl';
import { GetCompanySettingsUseCaseImpl } from '@/features/admin-settings/domain/use-cases/GetCompanySettingsUseCase';
import { UpdateCompanySettingsUseCaseImpl } from '@/features/admin-settings/domain/use-cases/UpdateCompanySettingsUseCase';
import { ListCompaniesUseCaseImpl } from '@/features/admin-settings/domain/use-cases/ListCompaniesUseCase';
import { JobManagementRemoteDataSourceImpl } from '@/features/admin-jobs/data/data-sources/JobManagementRemoteDataSource';
import { JobManagementMapperImpl } from '@/features/admin-jobs/data/mappers/JobManagementMapper';
import { JobManagementRepositoryImpl } from '@/features/admin-jobs/data/repositories/JobManagementRepositoryImpl';
import { GetAdminJobsUseCaseImpl } from '@/features/admin-jobs/domain/use-cases/GetAdminJobsUseCase';
import { GetAdminJobDetailUseCaseImpl } from '@/features/admin-jobs/domain/use-cases/GetAdminJobDetailUseCase';
import { CreateJobUseCaseImpl } from '@/features/admin-jobs/domain/use-cases/CreateJobUseCase';
import { UpdateJobUseCaseImpl } from '@/features/admin-jobs/domain/use-cases/UpdateJobUseCase';
import { DeleteJobUseCaseImpl } from '@/features/admin-jobs/domain/use-cases/DeleteJobUseCase';
import { VerifyCompanyConnectionUseCaseImpl } from '@/features/admin-onboarding/domain/use-cases/VerifyCompanyConnectionUseCase';

// Infrastructure — Node.js module cache provides free singletons.
const httpClient = createUnauthenticatedHTTPClient(
  process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? '',
);
const errorMapper = new ErrorMapperImpl();
const appsScriptDataSource = new AppsScriptDataSource(httpClient);

const companyRepository = new CompanyRepositoryImpl(appsScriptDataSource, errorMapper);
const jobRepository = new JobRepositoryImpl(appsScriptDataSource, errorMapper);

export const getCompanyBySlugUseCase = new GetCompanyBySlugUseCaseImpl(companyRepository);
export const getJobsUseCase = new GetJobsUseCaseImpl(jobRepository);
export const getJobDetailUseCase = new GetJobDetailUseCaseImpl(jobRepository);
export const getJobDetailBySlugUseCase = new GetJobDetailBySlugUseCaseImpl(jobRepository);

// Admin auth
const adminDataSource = new AdminDataSource(httpClient, process.env.ADMIN_API_SECRET ?? '');
const bcryptVerifier = new BcryptPasswordVerifier();
const adminRepository = new AdminRepositoryImpl(adminDataSource, errorMapper);

export const loginAdminUseCase = () => new LoginAdminUseCaseImpl(adminRepository, bcryptVerifier);

// Admin settings
const companySettingsRepository = new CompanySettingsRepositoryImpl(
  appsScriptDataSource,
  errorMapper,
);
export const listCompaniesUseCase = new ListCompaniesUseCaseImpl(companySettingsRepository);
export const getCompanySettingsUseCase = new GetCompanySettingsUseCaseImpl(
  companySettingsRepository,
);
export const updateCompanySettingsUseCase = () =>
  new UpdateCompanySettingsUseCaseImpl(companySettingsRepository);

// Admin job management
const jobManagementDataSource = new JobManagementRemoteDataSourceImpl(
  httpClient,
  process.env.ADMIN_API_SECRET ?? '',
);
const jobManagementMapper = new JobManagementMapperImpl();
const jobManagementRepository = new JobManagementRepositoryImpl(
  jobManagementDataSource,
  jobManagementMapper,
  errorMapper,
);

export const getAdminJobsUseCase = new GetAdminJobsUseCaseImpl(jobManagementRepository);
export const getAdminJobDetailUseCase = new GetAdminJobDetailUseCaseImpl(jobManagementRepository);
export const createJobUseCase = () => new CreateJobUseCaseImpl(jobManagementRepository);
export const updateJobUseCase = () => new UpdateJobUseCaseImpl(jobManagementRepository);
export const deleteJobUseCase = () => new DeleteJobUseCaseImpl(jobManagementRepository);

// Admin onboarding
export const verifyCompanyConnectionUseCase = new VerifyCompanyConnectionUseCaseImpl(
  companyRepository,
);
