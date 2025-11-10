import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Logout confirmation modal
 */
export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Logout"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to logout?
        </p>
        {user && (
          <p className="text-sm text-gray-500">
            You are currently logged in as <strong>{user.email}</strong>
          </p>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={onClose} variant="secondary" className="px-4 py-2">
            Cancel
          </Button>
          <Button onClick={handleLogout} variant="danger" className="px-4 py-2">
            Logout
          </Button>
        </div>
      </div>
    </Modal>
  );
}

