import api from './api';

/**
 * Post Service - Handles all post-related API operations
 * Following the same pattern as authService for consistency
 */
export const postService = {
  /**
   * Create a new post with optional media files
   * @param {Object} postData - Post creation data
   * @param {string} postData.caption - Post caption (optional)
   * @param {string} postData.location - Post location (optional)
   * @param {string} postData.visibility - Post visibility (public/followers/private)
   * @param {File[]} postData.files - Array of media files (optional)
   * @param {string[]} postData.types - Array of media types corresponding to files
   * @param {Function} onUploadProgress - Progress callback function
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  createPost: async (postData, onUploadProgress = null) => {
    try {
      const { caption = '', location = '', visibility = 'public', files = [], types = [] } = postData;

      // Validate files and types length match
      if (files.length !== types.length) {
        return {
          success: false,
          error: 'Files and types length must match'
        };
      }

      // Validate file count limit
      if (files.length > 5) {
        return {
          success: false,
          error: 'Maximum 5 files allowed per post'
        };
      }

      // Validate file sizes (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      for (const file of files) {
        if (file.size > maxSize) {
          return {
            success: false,
            error: `File "${file.name}" exceeds 10MB limit`
          };
        }
      }

      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add text fields
      if (caption) formData.append('caption', caption);
      if (location) formData.append('location', location);
      formData.append('visibility', visibility);

      // Add files and types
      files.forEach((file, index) => {
        formData.append('files', file);
        formData.append('types', types[index]);
      });

      // Make API request with progress tracking
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Add upload progress callback if provided
      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.post('/posts/', formData, config);

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Create post error:', error);

      let errorMessage = 'Failed to create post. Please try again.';

      if (error.response?.status === 400) {
        const errData = error.response.data;
        
        // Handle validation errors
        if (typeof errData === 'object' && !Array.isArray(errData)) {
          const firstKey = Object.keys(errData)[0];
          errorMessage = errData[firstKey]?.[0] || errData[firstKey] || 'Invalid post data.';
        } else if (errData?.detail) {
          errorMessage = errData.detail;
        } else if (typeof errData === 'string') {
          errorMessage = errData;
        }
      } else if (error.response?.status === 413) {
        errorMessage = 'File size too large. Maximum 10MB per file allowed.';
      } else if (error.response?.status === 401) {
        errorMessage = 'You must be logged in to create a post.';
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   */
  validateFile: (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
    const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'];
    
    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File "${file.name}" exceeds 10MB limit`
      };
    }

    // Check file type
    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      return {
        isValid: false,
        error: `File "${file.name}" is not a supported image or video format`
      };
    }

    return {
      isValid: true,
      type: isImage ? 'image' : 'video'
    };
  },

  /**
   * Get file preview URL
   * @param {File} file - File to get preview for
   * @returns {string} Preview URL
   */
  getFilePreview: (file) => {
    return URL.createObjectURL(file);
  },

  /**
   * Clean up file preview URL
   * @param {string} url - Preview URL to clean up
   */
  cleanupFilePreview: (url) => {
    URL.revokeObjectURL(url);
  },

  /**
   * Fetch posts with pagination
   * @param {Object} options - Fetch options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Posts per page (default: 10)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  fetchPosts: async (options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await api.get(`/posts/?${params}`);

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Fetch posts error:', error);

      let errorMessage = 'Failed to fetch posts. Please try again.';

      if (error.response?.status === 401) {
        errorMessage = 'You must be logged in to view posts.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to view these posts.';
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Get media file URL with base URL
   * @param {string} filePath - File path from API
   * @returns {string} Full URL to media file
   */
  getMediaUrl: (filePath) => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    return `http://127.0.0.1:7000${filePath}`;
  },

  /**
   * Format post date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatPostDate: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }
};

export default postService;
