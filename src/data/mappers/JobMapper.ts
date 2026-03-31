import { type Job } from '@/features/career-microsite/domain/entities/Job';
import { type JobDTO } from '@/data/dtos/JobDTO';

export interface JobMapper {
  toDomain(dto: JobDTO): Job;
}
