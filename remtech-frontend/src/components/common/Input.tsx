import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            px-4 py-2.5 rounded-lg border text-sm outline-none transition-all
            focus:ring-2
            ${error ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-blue-100'}
            ${className}
          `}
          style={{ color: 'var(--color-text)' }}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;