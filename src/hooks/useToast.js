import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * Provides methods to show/hide toasts with different types
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  /**
   * Add a new toast notification
   */
  const showToast = useCallback((message, type = 'success', options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      isVisible: true,
      duration: options.duration || 3000,
      position: options.position || 'top-right',
      ...options
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove toast after duration + animation time
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration + 300);
    }

    return id;
  }, []);

  /**
   * Remove a specific toast
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Show success toast
   */
  const showSuccess = useCallback((message, options = {}) => {
    return showToast(message, 'success', options);
  }, [showToast]);

  /**
   * Show error toast
   */
  const showError = useCallback((message, options = {}) => {
    return showToast(message, 'error', options);
  }, [showToast]);

  /**
   * Show info toast
   */
  const showInfo = useCallback((message, options = {}) => {
    return showToast(message, 'info', options);
  }, [showToast]);

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showInfo,
    removeToast,
    clearToasts
  };
};

export default useToast;
