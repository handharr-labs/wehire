import 'client-only';

import { createUnauthenticatedHTTPClient } from '@/data/networking/AxiosHTTPClient';
import { ErrorMapperImpl } from '@/data/mappers/ErrorMapper';
import { AppsScriptDataSource } from '@/features/career-microsite/data/data-sources/AppsScriptDataSource';
import { ApplicationRepositoryImpl } from '@/features/career-microsite/data/repositories/ApplicationRepositoryImpl';
import { SubmitApplicationUseCaseImpl } from '@/features/career-microsite/domain/use-cases/SubmitApplicationUseCase';

export function createClientContainer() {
  const httpClient = createUnauthenticatedHTTPClient(
    process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? '',
  );
  const errorMapper = new ErrorMapperImpl();
  const appsScriptDataSource = new AppsScriptDataSource(httpClient);
  const applicationRepository = new ApplicationRepositoryImpl(appsScriptDataSource, errorMapper);

  return {
    get submitApplicationUseCase() {
      return new SubmitApplicationUseCaseImpl(applicationRepository);
    },
  };
}

export type ClientContainer = ReturnType<typeof createClientContainer>;
