import { Booking } from '../lib/types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { formatDateTime } from '../lib/utils/date';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * Cancel booking confirmation modal
 */
export function CancelBookingModal({
  isOpen,
  onClose,
  booking,
  onConfirm,
  isLoading = false,
}: CancelBookingModalProps) {
  if (!booking) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Booking"
      size="md"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to cancel this booking?
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-700">Resource: </span>
            <span className="text-sm text-gray-600">
              {booking.resource?.name || `Resource #${booking.resource_id}`}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Start Time: </span>
            <span className="text-sm text-gray-600">
              {formatDateTime(booking.start_time)}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">End Time: </span>
            <span className="text-sm text-gray-600">
              {formatDateTime(booking.end_time)}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={onClose}
            variant="secondary"
            className="px-4 py-2"
            disabled={isLoading}
          >
            Keep Booking
          </Button>
          <Button
            onClick={handleConfirm}
            variant="danger"
            className="px-4 py-2"
            isLoading={isLoading}
          >
            Cancel Booking
          </Button>
        </div>
      </div>
    </Modal>
  );
}

