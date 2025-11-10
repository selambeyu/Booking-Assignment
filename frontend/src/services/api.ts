import { Resource, Booking, LoginResponse } from '../lib/types';
import { api } from './client';

/**
 * Authentication API
 */
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },
};

/**
 * Resources API
 */
export const resourcesApi = {
  getAll: async (): Promise<Resource[]> => {
    const response = await api.get<Resource[]>('/resources');
    return response.data;
  },
  create: async (name: string): Promise<Resource> => {
    const response = await api.post<Resource>('/resources', { name });
    return response.data;
  },
};

/**
 * Bookings API
 */
export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },
  create: async (resourceId: number, startTime: string, endTime: string): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', {
      resource_id: resourceId,
      start_time: startTime,
      end_time: endTime,
    });
    return response.data;
  },
  cancel: async (id: number): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },
};
