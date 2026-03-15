import { type ApplicationPayload } from '../entities/ApplicationPayload';

export interface ApplicationRepository {
  submit(payload: ApplicationPayload): Promise<void>;
}
