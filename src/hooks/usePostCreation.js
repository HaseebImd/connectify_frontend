import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import postService from '../services/postService';

/**
 * Custom hook for managing post creation state and operations
 * Handles form data, validation, submission, and navigation
 */
export const usePostCreation = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    caption: '',
    location: '',
    visibility: 'public',
    files: [],
    types: []
  });

  const [state, setState] = useState({
    isSubmitting: false,
    uploadProgress: 0,
    errors: {},
    isModalOpen: false
  });

  /**
   * Update form field value
   */
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (state.errors[field]) {
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: null
        }
      }));
    }
  }, [state.errors]);

  /**
   * Add files to the post
   */
  const addFiles = useCallback((newFiles) => {
    const validFiles = [];
    const validTypes = [];
    const errors = [];

    // Validate each file
    newFiles.forEach(file => {
      const validation = postService.validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
        validTypes.push(validation.type);
      } else {
        errors.push(validation.error);
      }
    });

    // Check total file count
    const totalFiles = formData.files.length + validFiles.length;
    if (totalFiles > 5) {
      errors.push('Maximum 5 files allowed per post');
      return { success: false, errors };
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...validFiles],
        types: [...prev.types, ...validTypes]
      }));
    }

    return { 
      success: validFiles.length > 0, 
      errors: errors.length > 0 ? errors : null,
      addedCount: validFiles.length
    };
  }, [formData.files.length]);

  /**
   * Remove file from the post
   */
  const removeFile = useCallback((index) => {
    // Clean up preview URL
    const fileToRemove = formData.files[index];
    if (fileToRemove) {
      const previewUrl = postService.getFilePreview(fileToRemove);
      postService.cleanupFilePreview(previewUrl);
    }

    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
      types: prev.types.filter((_, i) => i !== index)
    }));
  }, [formData.files]);

  /**
   * Clear all form data
   */
  const clearForm = useCallback(() => {
    // Clean up all preview URLs
    formData.files.forEach(file => {
      const previewUrl = postService.getFilePreview(file);
      postService.cleanupFilePreview(previewUrl);
    });

    setFormData({
      caption: '',
      location: '',
      visibility: 'public',
      files: [],
      types: []
    });

    setState(prev => ({
      ...prev,
      errors: {},
      uploadProgress: 0
    }));
  }, [formData.files]);

  /**
   * Validate form before submission
   */
  const validateForm = useCallback(() => {
    const errors = {};

    // Caption is optional but if provided, should not be just whitespace
    if (formData.caption.trim() && formData.caption.trim().length > 2000) {
      errors.caption = 'Caption must be less than 2000 characters';
    }

    // Location validation
    if (formData.location.trim() && formData.location.trim().length > 255) {
      errors.location = 'Location must be less than 255 characters';
    }

    // At least caption or files should be provided
    if (!formData.caption.trim() && formData.files.length === 0) {
      errors.general = 'Please add a caption or select files to share';
    }

    setState(prev => ({
      ...prev,
      errors
    }));

    return Object.keys(errors).length === 0;
  }, [formData]);

  /**
   * Submit the post
   */
  const submitPost = useCallback(async () => {
    if (!validateForm()) {
      return { success: false, error: 'Please fix the errors above' };
    }

    setState(prev => ({
      ...prev,
      isSubmitting: true,
      uploadProgress: 0,
      errors: {}
    }));

    try {
      const result = await postService.createPost(
        formData,
        (progress) => {
          setState(prev => ({
            ...prev,
            uploadProgress: progress
          }));
        }
      );

      if (result.success) {
        // Clear form and close modal
        clearForm();
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          isModalOpen: false,
          uploadProgress: 0
        }));

        // Navigate to feed page
        navigate('/feed');

        return { success: true, data: result.data };
      } else {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          errors: { general: result.error }
        }));

        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Submit post error:', err);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        errors: { general: 'An unexpected error occurred' }
      }));

      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [formData, validateForm, clearForm, navigate]);

  /**
   * Open/close modal
   */
  const toggleModal = useCallback((isOpen) => {
    setState(prev => ({
      ...prev,
      isModalOpen: isOpen
    }));

    // Clear form when closing modal
    if (!isOpen) {
      clearForm();
    }
  }, [clearForm]);

  return {
    // Form data
    formData,
    
    // State
    isSubmitting: state.isSubmitting,
    uploadProgress: state.uploadProgress,
    errors: state.errors,
    isModalOpen: state.isModalOpen,
    
    // Actions
    updateField,
    addFiles,
    removeFile,
    clearForm,
    submitPost,
    toggleModal,
    
    // Computed values
    hasFiles: formData.files.length > 0,
    canAddMoreFiles: formData.files.length < 5,
    isFormValid: Object.keys(state.errors).length === 0
  };
};

export default usePostCreation;
