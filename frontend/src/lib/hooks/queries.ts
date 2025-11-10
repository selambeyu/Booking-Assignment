import { useQuery } from '@tanstack/react-query';
import { resourcesApi, bookingsApi } from '../../services/api';
import { Resource, Booking } from '../types';

/**
 * Query keys for React Query
 */
export const queryKeys = {
  resources: ['resources'] as const,
  bookings: ['bookings'] as const,
};

/**
 * Hook to fetch all resources using React Query
 */
export function useResources() {
  return useQuery<Resource[]>({
    queryKey: queryKeys.resources,
    queryFn: () => resourcesApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

/**
 * Hook to fetch all bookings using React Query
 */
export function useBookings() {
  return useQuery<Booking[]>({
    queryKey: queryKeys.bookings,
    queryFn: () => bookingsApi.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
}
