import React from 'react';
import { cn } from '../../lib/utils/cn';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const sizeClasses = {
  small: 'w-6 h-6',
  medium: 'w-10 h-10',
  large: 'w-16 h-16',
};

/**
 * Reusable Loading Spinner component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div
        className={cn(
          'border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin',
          sizeClasses[size]
        )}
        aria-label="Loading"
      ></div>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
};
