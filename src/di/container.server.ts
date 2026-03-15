import 'server-only';

import { createUnauthenticatedHTTPClient } from '@/data/networking/AxiosHTTPClient';
import { ErrorMapperImpl } from '@/data/mappers/ErrorMapper';
import { AppsScriptDataSource } from '@/features/career-microsite/data/data-sources/AppsScriptDataSource';
import { CompanyRepositoryImpl } from '@/features/career-microsite/data/repositories/CompanyRepositoryImpl';
import { JobRepositoryImpl } from '@/features/career-microsite/data/repositories/JobRepositoryImpl';
import { GetCompanyBySlugUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetCompanyBySlugUseCase';
import { GetJobsUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetJobsUseCase';
import { GetJobDetailUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetJobDetailUseCase';

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
