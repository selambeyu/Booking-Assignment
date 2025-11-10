export interface User {
  id: number;
  email: string;
  role: 'TENANT_ADMIN' | 'TENANT_USER';
  tenantId: number;
}

export interface Resource {
  id: number;
  name: string;
  tenant_id: number;
}

export interface Booking {
  id: number;
  resource_id: number;
  user_id: number;
  tenant_id: number;
  start_time: string;
  end_time: string;
  cancelled: boolean;
  resource?: Resource;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status?: number;
}
