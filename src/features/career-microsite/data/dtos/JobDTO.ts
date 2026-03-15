export interface JobDTO {
  id: string;
  company_id: string;
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
