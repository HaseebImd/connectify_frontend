import React, { useContext } from 'react';
import { X, MapPin, Image as ImageIcon } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import usePostCreation from '../../hooks/usePostCreation';
import useToast from '../../hooks/useToast';
import Button from '../ui/Button';
import FileUpload from './FileUpload';
import VisibilitySelector from './VisibilitySelector';

/**
 * Facebook-style Create Post Modal Component
 * Features: File upload, visibility settings, animated interactions
 */
const CreatePostModal = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  
  const {
    formData,
    isSubmitting,
    uploadProgress,
    errors,
    updateField,
    addFiles,
    removeFile,
    submitPost,
    hasFiles
  } = usePostCreation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await submitPost();
    
    if (result.success) {
      showSuccess('Post created successfully! 🎉');
      onClose();
    } else {
      showError(result.error || 'Failed to create post');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleFilesAdd = (newFiles) => {
    const result = addFiles(newFiles);
    
    if (result.errors) {
      result.errors.forEach(error => showError(error));
    }
    
    if (result.success && result.addedCount > 0) {
      showSuccess(`${result.addedCount} file(s) added successfully`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Create post</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profile_image ? (
                  <img
                    src={`http://127.0.0.1:7000${user.profile_image}`}
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.username || 'User'}</p>
                <VisibilitySelector
                  value={formData.visibility}
                  onChange={(value) => updateField('visibility', value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Caption Input */}
            <div className="space-y-2">
              <textarea
                placeholder={`What's on your mind, ${user?.username || 'User'}?`}
                value={formData.caption}
                onChange={(e) => updateField('caption', e.target.value)}
                disabled={isSubmitting}
                className="w-full p-3 border-0 resize-none focus:outline-none text-gray-900 placeholder-gray-500 text-lg leading-relaxed min-h-[100px]"
                maxLength={2000}
              />
              {errors.caption && (
                <p className="text-sm text-red-600">{errors.caption}</p>
              )}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{formData.caption.length}/2000 characters</span>
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Add location"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={255}
                />
              </div>
              {errors.location && (
                <p className="text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <FileUpload
                files={formData.files}
                onFilesAdd={handleFilesAdd}
                onFileRemove={removeFile}
                maxFiles={5}
                disabled={isSubmitting}
              />
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Upload Progress */}
            {isSubmitting && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ImageIcon className="w-4 h-4" />
                <span>Add to your post</span>
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting || (!formData.caption.trim() && !hasFiles)}
                loading={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
