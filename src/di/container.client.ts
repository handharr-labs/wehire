import 'client-only';

import { createUnauthenticatedHTTPClient } from '@/data/networking/AxiosHTTPClient';
import { ErrorMapperImpl } from '@/data/mappers/ErrorMapper';
import { AppsScriptDataSource } from '@/features/career-microsite/data/data-sources/AppsScriptDataSource';
import { ApplicationRepositoryImpl } from '@/features/career-microsite/data/repositories/ApplicationRepositoryImpl';
import { JobRepositoryImpl } from '@/features/career-microsite/data/repositories/JobRepositoryImpl';
import { SubmitApplicationUseCaseImpl } from '@/features/career-microsite/domain/use-cases/SubmitApplicationUseCase';
import { GetJobDetailUseCaseImpl } from '@/features/career-microsite/domain/use-cases/GetJobDetailUseCase';

export function createClientContainer() {
  const httpClient = createUnauthenticatedHTTPClient(
    process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? '',
  );
  const errorMapper = new ErrorMapperImpl();
  const appsScriptDataSource = new AppsScriptDataSource(httpClient);
  const applicationRepository = new ApplicationRepositoryImpl(appsScriptDataSource, errorMapper);
  const jobRepository = new JobRepositoryImpl(appsScriptDataSource, errorMapper);
  const getJobDetailUseCase = new GetJobDetailUseCaseImpl(jobRepository);

  return {
    get submitApplicationUseCase() {
      return new SubmitApplicationUseCaseImpl(applicationRepository, getJobDetailUseCase);
    },
  };
}

export type ClientContainer = ReturnType<typeof createClientContainer>;
