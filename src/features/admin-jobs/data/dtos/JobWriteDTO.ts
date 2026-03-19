export interface CreateJobDTO {
  companyId: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  min_salary: number;
  max_salary: number;
  description: string;
  requirements: string;
  status: string;
  expired_at: string;
  sort_order: number;
}

export interface UpdateJobDTO {
  title?: string;
  department?: string;
  location?: string;
  employment_type?: string;
  min_salary?: number;
  max_salary?: number;
  description?: string;
  requirements?: string;
  status?: string;
  expired_at?: string;
  sort_order?: number;
}

export interface JobWriteResultDTO {
  id: string;
  created_at?: string;
}
