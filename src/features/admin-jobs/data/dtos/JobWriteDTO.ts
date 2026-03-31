export interface CreateJobDTO {
  readonly companyId: string;
  readonly title: string;
  readonly department: string;
  readonly location: string;
  readonly employment_type: string;
  readonly min_salary: number;
  readonly max_salary: number;
  readonly description: string;
  readonly requirements: string;
  readonly status: string;
  readonly expired_at: string;
  readonly sort_order: number;
}

export interface UpdateJobDTO {
  readonly title?: string;
  readonly department?: string;
  readonly location?: string;
  readonly employment_type?: string;
  readonly min_salary?: number;
  readonly max_salary?: number;
  readonly description?: string;
  readonly requirements?: string;
  readonly status?: string;
  readonly expired_at?: string;
  readonly sort_order?: number;
}

export interface JobWriteResultDTO {
  readonly id: string;
  readonly created_at?: string;
}
