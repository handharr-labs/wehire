import { type Job } from '@/shared/domain/entities/Job';
import { type JobMapper } from '@/shared/data/mappers/JobMapper';
import { type CreateJobInput, type UpdateJobInput } from '../../domain/repositories/JobManagementRepository';
import { type JobDTO } from '@/data/dtos/JobDTO';
import { type CreateJobDTO, type UpdateJobDTO } from '../dtos/JobWriteDTO';

export interface JobManagementMapper {
  toDomain(dto: JobDTO): Job;
  toCreateDTO(input: CreateJobInput): CreateJobDTO;
  toUpdateDTO(input: UpdateJobInput): UpdateJobDTO;
}

export class JobManagementMapperImpl implements JobManagementMapper {
  constructor(private readonly jobMapper: JobMapper) {}

  toDomain(dto: JobDTO): Job {
    return this.jobMapper.toDomain(dto);
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
    return {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.department !== undefined && { department: input.department }),
      ...(input.location !== undefined && { location: input.location }),
      ...(input.employmentType !== undefined && { employment_type: input.employmentType }),
      ...(input.minSalary !== undefined && { min_salary: input.minSalary }),
      ...(input.maxSalary !== undefined && { max_salary: input.maxSalary }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.requirements !== undefined && { requirements: input.requirements }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.expiredAt !== undefined && { expired_at: input.expiredAt }),
      ...(input.sortOrder !== undefined && { sort_order: input.sortOrder }),
    };
  }
}
