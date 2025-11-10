import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi, bookingsApi } from '../../services/api';
import { Resource, Booking } from '../types';
import { queryKeys } from './queries';

/**
 * Hook to create a resource using React Query
 */
export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation<Resource, Error, string>({
    mutationFn: (name: string) => resourcesApi.create(name),
    onSuccess: () => {
      // Invalidate and refetch resources after successful creation
      queryClient.invalidateQueries({ queryKey: queryKeys.resources });
    },
  });
}

/**
 * Hook to create a booking using React Query
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<
    Booking,
    Error,
    { resourceId: number; startTime: string; endTime: string }
  >({
    mutationFn: ({ resourceId, startTime, endTime }) =>
      bookingsApi.create(resourceId, startTime, endTime),
    onSuccess: () => {
      // Invalidate and refetch bookings after successful creation
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    },
  });
}

/**
 * Hook to cancel a booking using React Query
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, number>({
    mutationFn: (id: number) => bookingsApi.cancel(id),
    onSuccess: () => {
      // Invalidate and refetch bookings after successful cancellation
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
    },
  });
}
