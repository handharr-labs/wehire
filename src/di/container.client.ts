import 'client-only';

import { createUnauthenticatedHTTPClient } from '@/data/networking/AxiosHTTPClient';
import { ErrorMapperImpl } from '@/data/mappers/ErrorMapper';
import { AppsScriptDataSourceImpl } from '@/features/career-microsite/data/data-sources/AppsScriptDataSourceImpl';
import { JobMapperImpl } from '@/shared/data/mappers/JobMapper';
import { ApplicationRepositoryImpl } from '@/features/career-microsite/data/repositories/ApplicationRepositoryImpl';
import { JobRepositoryImpl } from '@/features/career-microsite/data/repositories/JobRepositoryImpl';
import { SubmitApplicationUseCaseImpl } from '@/features/career-microsite/domain/use-cases/SubmitApplicationUseCase';
import { GetJobDetailUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetJobDetailUseCase';

const httpClient = createUnauthenticatedHTTPClient(
  process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? '',
);
const errorMapper = new ErrorMapperImpl();
const appsScriptDataSource = new AppsScriptDataSourceImpl(httpClient);
const jobMapper = new JobMapperImpl();
const applicationRepository = new ApplicationRepositoryImpl(appsScriptDataSource, errorMapper);
const jobRepository = new JobRepositoryImpl(appsScriptDataSource, jobMapper, errorMapper);
const getJobDetailUseCase = new GetJobDetailUseCaseImpl(jobRepository);

export const submitApplicationUseCase = new SubmitApplicationUseCaseImpl(
  applicationRepository,
  getJobDetailUseCase,
);
