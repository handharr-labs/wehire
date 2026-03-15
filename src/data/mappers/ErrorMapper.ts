// data/mappers/ErrorMapper.ts
import { DomainError } from '@/shared/domain/errors/DomainError';
import { type NetworkError } from '../networking/NetworkError';

export interface ErrorMapper {
  toDomain(error: NetworkError): DomainError;
}

export class ErrorMapperImpl implements ErrorMapper {
  toDomain(error: NetworkError): DomainError {
    switch (error.type) {
      case 'httpError':
        if (error.statusCode === 401) return DomainError.unauthorized();
        if (error.statusCode === 404) return DomainError.notFound('Resource', '');
        if (error.statusCode !== undefined && error.statusCode >= 500) {
          return DomainError.serverError(error.message ?? 'Server error');
        }
        return new DomainError('unknown', { statusCode: error.statusCode });
      case 'noConnection':
      case 'timeout':
        return DomainError.networkUnavailable();
      default:
        return new DomainError('unknown', { message: error.message });
    }
  }
}
