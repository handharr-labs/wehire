import { type Job, type EmploymentType, type JobStatus } from '../../domain/entities/Job';
import { type JobDTO } from '../dtos/JobDTO';

export class JobMapper {
  static toDomain(dto: JobDTO): Job {
    return {
      id: dto.id,
      companyId: dto.company_id,
      title: dto.title,
      department: dto.department,
      location: dto.location,
      employmentType: (dto.employment_type as EmploymentType) ?? 'full-time',
      minSalary: dto.min_salary,
      maxSalary: dto.max_salary,
      description: dto.description,
      requirements: dto.requirements,
      status: (dto.status === 'open' ? 'active' : (dto.status as JobStatus)) ?? 'active',
      expiredAt: dto.expired_at,
      sortOrder: dto.sort_order,
    };
  }
}
