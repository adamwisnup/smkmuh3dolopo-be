import { AdminRole, StatusUser } from '../../generated/prisma';

export interface AdminResponse {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: StatusUser;
  created_at: Date;
  updated_at: Date;
}

export interface AdminListResponse {
  data: AdminResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}