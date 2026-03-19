import { type Admin } from '../../domain/entities/Admin';
import { type AdminRepository } from '../../domain/repositories/AdminRepository';
import { type AdminDataSource } from '../data-sources/AdminDataSource';
import { AdminMapper } from '../mappers/AdminMapper';
import { type ErrorMapper } from '@/data/mappers/ErrorMapper';
import { type NetworkError } from '@/data/networking/NetworkError';

export class AdminRepositoryImpl implements AdminRepository {
  constructor(
    private readonly dataSource: AdminDataSource,
    private readonly errorMapper: ErrorMapper,
  ) {}

  async findByEmail(email: string): Promise<Admin | null> {
    try {
      const dto = await this.dataSource.findAdminByEmail(email);
      if (!dto) return null;
      return AdminMapper.toDomain(dto);
    } catch (error) {
      throw this.errorMapper.toDomain(error as NetworkError);
    }
  }
}
