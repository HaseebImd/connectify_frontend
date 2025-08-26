import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

/**
 * Toast notification component with animations
 * Supports success, error, and info types
 */
const Toast = ({ 
  type = 'success', 
  message, 
  isVisible, 
  onClose, 
  duration = 3000,
  position = 'top-right' 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto-dismiss after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-white border-l-4 border-green-500';
      case 'error':
        return 'bg-white border-l-4 border-red-500';
      case 'info':
        return 'bg-white border-l-4 border-blue-500';
      default:
        return 'bg-white border-l-4 border-green-500';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed z-50 max-w-sm w-full
        ${getPositionClasses()}
        transition-all duration-300 ease-in-out
        ${isAnimating 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-2 scale-95'
        }
      `}
    >
      <div
        className={`
          ${getBackgroundColor()}
          rounded-lg shadow-lg p-4
          flex items-start space-x-3
          animate-slide-in
        `}
      >
        {/* Icon */}
        <div className="flex-shrink-0 pt-0.5">
          {getIcon()}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-5">
            {message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-150"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Toast container component for managing multiple toasts
 */
export const ToastContainer = ({ toasts = [], onRemoveToast }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          duration={toast.duration}
          position={toast.position}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
