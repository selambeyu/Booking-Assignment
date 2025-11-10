import React from 'react';
import { cn } from '../../lib/utils/cn';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

/**
 * Reusable Error Message component with optional close button
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div
      className={cn(
        'bg-red-50 text-red-800 px-4 py-3 rounded-md mb-4',
        'border border-red-200 flex items-center justify-between gap-4'
      )}
      role="alert"
    >
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-800 hover:text-red-900 text-2xl font-bold leading-none"
          aria-label="Close error message"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
};
