import React, { useRef, useState } from 'react';
import { Upload, Image, Video, X } from 'lucide-react';

/**
 * File upload component with drag-and-drop functionality
 * Supports multiple files with preview
 */
const FileUpload = ({ 
  files = [], 
  onFilesAdd, 
  onFileRemove, 
  maxFiles = 5, 
  disabled = false 
}) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFilesAdd(droppedFiles);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      onFilesAdd(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const getFilePreview = (file) => {
    return URL.createObjectURL(file);
  };

  const isImage = (file) => {
    return file.type.startsWith('image/');
  };

  const isVideo = (file) => {
    return file.type.startsWith('video/');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canAddMoreFiles = files.length < maxFiles;

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {canAddMoreFiles && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />

          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className={`w-6 h-6 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isDragOver ? 'Drop files here' : 'Add photos/videos'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or click to browse • Max {maxFiles} files • 10MB each
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
            >
              {/* Preview */}
              <div className="w-full h-full flex items-center justify-center">
                {isImage(file) ? (
                  <img
                    src={getFilePreview(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : isVideo(file) ? (
                  <div className="relative w-full h-full">
                    <video
                      src={getFilePreview(file)}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-xs text-center px-2">{file.name}</span>
                  </div>
                )}
              </div>

              {/* File Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <p className="text-white text-xs truncate">{file.name}</p>
                <p className="text-white text-xs opacity-75">{formatFileSize(file.size)}</p>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove(index);
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File Count Info */}
      {files.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{files.length} of {maxFiles} files selected</span>
          {!canAddMoreFiles && (
            <span className="text-amber-600">Maximum files reached</span>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
