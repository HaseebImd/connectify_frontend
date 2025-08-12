import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  fullWidth = false,
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-13 px-4 text-lg',
  };

  const currentSizeClass = sizeClasses[size];
  const widthClass = fullWidth ? 'w-full' : '';

  const inputClasses = [
    'font-sans text-gray-900 bg-white border rounded-lg outline-none transition-all duration-200',
    'focus:border-blue-600 focus:ring-2 focus:ring-blue-100',
    'disabled:bg-gray-100 disabled:cursor-not-allowed',
    error ? 'border-red-500' : 'border-gray-300',
    leftIcon ? 'pl-11' : '',
    rightIcon ? 'pr-11' : '',
    currentSizeClass,
    widthClass
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'flex flex-col gap-1',
    widthClass
  ].filter(Boolean).join(' ');

  return (
    <div className={`${containerClasses} ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-900 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-xs text-red-500 mt-1">
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div className="text-xs text-gray-600 mt-1">
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
