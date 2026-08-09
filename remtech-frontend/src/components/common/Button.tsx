import { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variants = {
    primary: 'text-white hover:opacity-90',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border bg-white hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const primaryStyle =
    variant === 'primary'
      ? { background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }
      : variant === 'outline'
      ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }
      : {};

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={primaryStyle}
      className={`
        ${sizes[size]}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        font-medium rounded-lg transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {isLoading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
}