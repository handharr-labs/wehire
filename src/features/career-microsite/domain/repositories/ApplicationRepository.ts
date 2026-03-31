import { type ApplicationPayload } from '@/shared/domain/entities/ApplicationPayload';

export interface ApplicationRepository {
  submit(payload: ApplicationPayload): Promise<void>;
}
