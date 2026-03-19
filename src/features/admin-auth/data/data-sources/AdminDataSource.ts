import { type HTTPClient } from '@/data/networking/HTTPClient';
import { type AdminDTO } from '../dtos/AdminDTO';

interface AdminResponse {
  data: AdminDTO;
}

interface ErrorResponse {
  error: string;
}

export class AdminDataSource {
  constructor(
    private readonly httpClient: HTTPClient,
    private readonly adminApiSecret: string,
  ) {}

  async findAdminByEmail(email: string): Promise<AdminDTO | null> {
    const response = await this.httpClient.post<AdminResponse | ErrorResponse>('', {
      action: 'getAdminByEmail',
      secret: this.adminApiSecret,
      email,
    });

    if ('error' in response) return null;
    return response.data;
  }
}
