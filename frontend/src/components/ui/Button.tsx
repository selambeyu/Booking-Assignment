import React from 'react';
import { cn } from '../../lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
};

/**
 * Reusable Button component with variants and loading state
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={cn(
        'px-6 py-3 rounded-md font-medium transition-colors duration-200',
        'inline-flex items-center justify-center gap-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'primary' && 'focus:ring-blue-500',
        variant === 'danger' && 'focus:ring-red-500',
        variant === 'secondary' && 'focus:ring-gray-500',
        variantClasses[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};
