import { type Job, type EmploymentType, type JobStatus } from '@/features/career-microsite/domain/entities/Job';
import { type CreateJobInput, type UpdateJobInput } from '../../domain/repositories/IJobManagementRepository';
import { type JobDTO } from '@/features/career-microsite/data/dtos/JobDTO';
import { type CreateJobDTO, type UpdateJobDTO } from '../dtos/JobWriteDTO';

export interface IJobManagementMapper {
  toDomain(dto: JobDTO): Job;
  toCreateDTO(input: CreateJobInput): CreateJobDTO;
  toUpdateDTO(input: UpdateJobInput): UpdateJobDTO;
}

export class JobManagementMapperImpl implements IJobManagementMapper {
  toDomain(dto: JobDTO): Job {
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

  toCreateDTO(input: CreateJobInput): CreateJobDTO {
    return {
      companyId: input.companyId,
      title: input.title,
      department: input.department,
      location: input.location,
      employment_type: input.employmentType,
      min_salary: input.minSalary,
      max_salary: input.maxSalary,
      description: input.description,
      requirements: input.requirements,
      status: input.status,
      expired_at: input.expiredAt,
      sort_order: input.sortOrder,
    };
  }

  toUpdateDTO(input: UpdateJobInput): UpdateJobDTO {
    const dto: UpdateJobDTO = {};
    if (input.title !== undefined) dto.title = input.title;
    if (input.department !== undefined) dto.department = input.department;
    if (input.location !== undefined) dto.location = input.location;
    if (input.employmentType !== undefined) dto.employment_type = input.employmentType;
    if (input.minSalary !== undefined) dto.min_salary = input.minSalary;
    if (input.maxSalary !== undefined) dto.max_salary = input.maxSalary;
    if (input.description !== undefined) dto.description = input.description;
    if (input.requirements !== undefined) dto.requirements = input.requirements;
    if (input.status !== undefined) dto.status = input.status;
    if (input.expiredAt !== undefined) dto.expired_at = input.expiredAt;
    if (input.sortOrder !== undefined) dto.sort_order = input.sortOrder;
    return dto;
  }
}
