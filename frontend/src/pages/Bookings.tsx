import { useState } from 'react';
import { Booking } from '../lib/types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CancelBookingModal } from '../components/CancelBookingModal';
import { useBookings, useResources, useCreateBooking, useCancelBooking } from '../lib/hooks';
import { formatDateTime, toISOString } from '../lib/utils/date';

function Bookings() {
  const [showForm, setShowForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    resource_id: 0,
    start_time: '',
    end_time: '',
  });

  const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useBookings();
  const { data: resources = [], isLoading: resourcesLoading, error: resourcesError } = useResources();
  const createMutation = useCreateBooking();
  const cancelMutation = useCancelBooking();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resource_id || !formData.start_time || !formData.end_time) {
      return;
    }

    try {
      const startTimeISO = toISOString(formData.start_time);
      const endTimeISO = toISOString(formData.end_time);

      await createMutation.mutateAsync({
        resourceId: formData.resource_id,
        startTime: startTimeISO,
        endTime: endTimeISO,
      });
      setFormData({ resource_id: 0, start_time: '', end_time: '' });
      setShowForm(false);
      // Cache is automatically invalidated by React Query, data will refetch
    } catch (err) {
      // Error handled by useMutation hook
    }
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;

    try {
      await cancelMutation.mutateAsync(selectedBooking.id);
      setShowCancelModal(false);
      setSelectedBooking(null);
      // Cache is automatically invalidated by React Query, data will refetch
    } catch (err) {
      // Error handled by useMutation hook
    }
  };

  if (bookingsLoading || resourcesLoading) {
    return <LoadingSpinner message="Loading bookings..." />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? 'Cancel' : 'Create Booking'}
        </Button>
      </div>

      {bookingsError && (
        <ErrorMessage message={bookingsError.message} onClose={() => refetchBookings()} />
      )}
      {resourcesError && (
        <ErrorMessage message={resourcesError.message} onClose={() => {}} />
      )}
      {createMutation.error && (
        <ErrorMessage message={createMutation.error.message} onClose={() => createMutation.reset()} />
      )}
      {cancelMutation.error && (
        <ErrorMessage message={cancelMutation.error.message} onClose={() => cancelMutation.reset()} />
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="flex flex-col gap-4 mb-8 p-6 bg-white rounded-lg shadow">
          <div>
            <label htmlFor="resource" className="block text-sm font-medium text-gray-700 mb-2">
              Resource
            </label>
            <select
              id="resource"
              value={formData.resource_id}
              onChange={(e) =>
                setFormData({ ...formData, resource_id: parseInt(e.target.value) })
              }
              required
              disabled={createMutation.isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value={0}>Select a resource</option>
              {resources && resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            type="datetime-local"
            label="Start Time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            required
            disabled={createMutation.isPending}
            className="mb-0"
          />
          
          <Input
            type="datetime-local"
            label="End Time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            required
            disabled={createMutation.isPending}
            className="mb-0"
          />
          
          <Button type="submit" isLoading={createMutation.isPending} variant="primary">
            Create Booking
          </Button>
        </form>
      )}

      {!bookings || bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-2">You have no bookings yet.</p>
          <p className="text-gray-500">Create your first booking to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`bg-white p-6 rounded-lg shadow transition-shadow ${
                booking.cancelled
                  ? 'opacity-60 bg-gray-50'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {booking.resource?.name || `Resource #${booking.resource_id}`}
                </h3>
                {booking.cancelled && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Cancelled
                  </span>
                )}
              </div>
              <div className="mb-4 space-y-2">
                <p className="text-gray-600">
                  <strong>Start:</strong> {formatDateTime(booking.start_time)}
                </p>
                <p className="text-gray-600">
                  <strong>End:</strong> {formatDateTime(booking.end_time)}
                </p>
              </div>
              {!booking.cancelled && (
                <Button
                  onClick={() => handleCancelClick(booking)}
                  variant="danger"
                  className="w-full"
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onConfirm={handleCancelConfirm}
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
}

export default Bookings;
