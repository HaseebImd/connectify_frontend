import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  className = '',
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-md border-0',
    outlined: 'bg-white border border-gray-300 shadow-none',
    ghost: 'bg-transparent border-0 shadow-none',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  const classes = [
    'rounded-xl transition-all duration-200',
    variantClasses[variant],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
