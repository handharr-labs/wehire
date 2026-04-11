import 'server-only';

import { AxiosHTTPClient } from '@/data/networking/AxiosHTTPClient';
import { ErrorMapperImpl } from '@/data/mappers/ErrorMapper';
import { AppsScriptDataSourceImpl } from '@/data/data-sources/AppsScriptDataSourceImpl';
import { CompanyMapperImpl } from '@/shared/data/mappers/CompanyMapper';
import { JobMapperImpl } from '@/shared/data/mappers/JobMapper';
import { CompanyRepositoryImpl } from '@/features/career-microsite/data/repositories/CompanyRepositoryImpl';
import { JobRepositoryImpl } from '@/features/career-microsite/data/repositories/JobRepositoryImpl';
import { GetCompanyBySlugUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetCompanyBySlugUseCase';
import { GetJobsUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetJobsUseCase';
import { GetJobDetailUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetJobDetailUseCase';
import { GetJobDetailBySlugUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetJobDetailBySlugUseCase';
import { AdminDataSourceImpl } from '@/features/admin-auth/data/data-sources/AdminDataSource';
import { BcryptPasswordVerifierImpl } from '@/features/admin-auth/data/services/BcryptPasswordVerifier';
import { AdminMapperImpl } from '@/features/admin-auth/data/mappers/AdminMapper';
import { AdminRepositoryImpl } from '@/features/admin-auth/data/repositories/AdminRepositoryImpl';
import { LoginAdminUseCaseImpl } from '@/features/admin-auth/domain/use-cases/LoginAdminUseCase';
import { CompanySettingsRepositoryImpl } from '@/features/admin-settings/data/repositories/CompanySettingsRepositoryImpl';
import { GetCompanySettingsUseCaseImpl } from '@/features/admin-settings/domain/use-cases/GetCompanySettingsUseCase';
import { UpdateCompanySettingsUseCaseImpl } from '@/features/admin-settings/domain/use-cases/UpdateCompanySettingsUseCase';
import { ListCompaniesUseCaseImpl } from '@/features/admin-settings/domain/use-cases/ListCompaniesUseCase';
import { LaunchCompanyUseCaseImpl } from '@/features/admin-onboarding/domain/use-cases/LaunchCompanyUseCase';
import { SaveCompanyProfileUseCaseImpl } from '@/features/admin-onboarding/domain/use-cases/SaveCompanyProfileUseCase';
import { JobManagementRemoteDataSourceImpl } from '@/features/admin-jobs/data/data-sources/JobManagementRemoteDataSource';
import { JobManagementMapperImpl } from '@/features/admin-jobs/data/mappers/JobManagementMapper';
import { JobManagementRepositoryImpl } from '@/features/admin-jobs/data/repositories/JobManagementRepositoryImpl';
import { GetAdminJobsUseCaseImpl } from '@/features/admin-jobs/domain/use-cases/GetAdminJobsUseCase';
import { GetAdminJobDetailUseCaseImpl } from '@/features/admin-jobs/domain/use-cases/GetAdminJobDetailUseCase';
import { CreateJobUseCaseImpl } from '@/features/admin-jobs/domain/use-cases/CreateJobUseCase';
import { UpdateJobUseCaseImpl } from '@/features/admin-jobs/domain/use-cases/UpdateJobUseCase';
import { DeleteJobUseCaseImpl } from '@/features/admin-jobs/domain/use-cases/DeleteJobUseCase';
import { VerifyCompanyConnectionUseCaseImpl } from '@/shared/domain/use-cases/VerifyCompanyConnectionUseCase';
import { FormFieldRemoteDataSourceImpl } from '@/features/admin-form-fields/data/data-sources/FormFieldRemoteDataSource';
import { FormFieldMapperImpl } from '@/features/admin-form-fields/data/mappers/FormFieldMapper';
import { FormFieldRepositoryImpl } from '@/features/admin-form-fields/data/repositories/FormFieldRepositoryImpl';
import { GetFormFieldsUseCaseImpl } from '@/features/admin-form-fields/domain/use-cases/GetFormFieldsUseCase';
import { CreateFormFieldUseCaseImpl } from '@/features/admin-form-fields/domain/use-cases/CreateFormFieldUseCase';
import { UpdateFormFieldUseCaseImpl } from '@/features/admin-form-fields/domain/use-cases/UpdateFormFieldUseCase';
import { DeleteFormFieldUseCaseImpl } from '@/features/admin-form-fields/domain/use-cases/DeleteFormFieldUseCase';
import { ReorderFormFieldsUseCaseImpl } from '@/features/admin-form-fields/domain/use-cases/ReorderFormFieldsUseCase';

// Infrastructure — Node.js module cache provides free singletons.
const httpClient = new AxiosHTTPClient(
  process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? '',
);
const errorMapper = new ErrorMapperImpl();
const appsScriptDataSource = new AppsScriptDataSourceImpl(httpClient);

const companyMapper = new CompanyMapperImpl();
const jobMapper = new JobMapperImpl();
const companyRepository = new CompanyRepositoryImpl(appsScriptDataSource, companyMapper, errorMapper);
const jobRepository = new JobRepositoryImpl(appsScriptDataSource, jobMapper, errorMapper);

export const getCompanyBySlugUseCase = new GetCompanyBySlugUseCaseImpl(companyRepository);
export const getJobsUseCase = new GetJobsUseCaseImpl(jobRepository);
export const getJobDetailUseCase = new GetJobDetailUseCaseImpl(jobRepository);
export const getJobDetailBySlugUseCase = new GetJobDetailBySlugUseCaseImpl(jobRepository);

// Admin auth
const adminDataSource = new AdminDataSourceImpl(httpClient, process.env.ADMIN_API_SECRET ?? '');
const bcryptVerifier = new BcryptPasswordVerifierImpl();
const adminMapper = new AdminMapperImpl();
const adminRepository = new AdminRepositoryImpl(adminDataSource, adminMapper, errorMapper);

export const loginAdminUseCase = new LoginAdminUseCaseImpl(adminRepository, bcryptVerifier);

// Admin settings
const companySettingsRepository = new CompanySettingsRepositoryImpl(
  appsScriptDataSource,
  companyMapper,
  errorMapper,
);
export const listCompaniesUseCase = new ListCompaniesUseCaseImpl(companySettingsRepository);
export const getCompanySettingsUseCase = new GetCompanySettingsUseCaseImpl(
  companySettingsRepository,
);
export const updateCompanySettingsUseCase = new UpdateCompanySettingsUseCaseImpl(
  companySettingsRepository,
);
export const launchCompanyUseCase = new LaunchCompanyUseCaseImpl(companySettingsRepository);
export const saveCompanyProfileUseCase = new SaveCompanyProfileUseCaseImpl(companySettingsRepository);

// Admin job management
const jobManagementDataSource = new JobManagementRemoteDataSourceImpl(
  httpClient,
  process.env.ADMIN_API_SECRET ?? '',
);
const jobManagementMapper = new JobManagementMapperImpl(jobMapper);
const jobManagementRepository = new JobManagementRepositoryImpl(
  jobManagementDataSource,
  jobManagementMapper,
  errorMapper,
);

export const getAdminJobsUseCase = new GetAdminJobsUseCaseImpl(jobManagementRepository);
export const getAdminJobDetailUseCase = new GetAdminJobDetailUseCaseImpl(jobManagementRepository);
export const createJobUseCase = new CreateJobUseCaseImpl(jobManagementRepository);
export const updateJobUseCase = new UpdateJobUseCaseImpl(jobManagementRepository);
export const deleteJobUseCase = new DeleteJobUseCaseImpl(jobManagementRepository);

// Admin onboarding
export const verifyCompanyConnectionUseCase = new VerifyCompanyConnectionUseCaseImpl(
  companyRepository,
);

// Form fields
const formFieldDataSource = new FormFieldRemoteDataSourceImpl(
  httpClient,
  process.env.ADMIN_API_SECRET ?? '',
);
const formFieldMapper = new FormFieldMapperImpl();
const formFieldRepository = new FormFieldRepositoryImpl(
  formFieldDataSource,
  formFieldMapper,
  errorMapper,
);
export const getFormFieldsUseCase = new GetFormFieldsUseCaseImpl(formFieldRepository);
export const createFormFieldUseCase = new CreateFormFieldUseCaseImpl(formFieldRepository);
export const updateFormFieldUseCase = new UpdateFormFieldUseCaseImpl(formFieldRepository);
export const deleteFormFieldUseCase = new DeleteFormFieldUseCaseImpl(formFieldRepository);
export const reorderFormFieldsUseCase = new ReorderFormFieldsUseCaseImpl(formFieldRepository);
