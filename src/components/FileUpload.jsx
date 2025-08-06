import React, { useState } from 'react';

const FileUpload = ({ 
  label, 
  name, 
  register, 
  error, 
  required = false,
  accept = "image/*",
  className = '' 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      // Trigger the register function with the file
      const event = {
        target: {
          name: name,
          files: e.dataTransfer.files
        }
      };
      register(name).onChange(event);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    // Clear the file input
    const fileInput = document.getElementById(name);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      <label htmlFor={name} className="block text-white text-xl font-semibold">
        <div className="flex items-center space-x-3">
          <svg
            className="w-6 h-6 text-pink-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span>{label}</span>
          {required && <span className="text-pink-400">*</span>}
        </div>
      </label>

      {!uploadedFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer
            ${dragActive
              ? 'border-pink-400 bg-pink-400/10'
              : error
                ? 'border-red-400 bg-red-400/10'
                : 'border-pink-500 bg-gray-800 hover:border-pink-400 hover:bg-gray-700'
            }
            ${className}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById(name).click()}
        >
          <input
            id={name}
            type="file"
            accept={accept}
            {...register(name)}
            onChange={(e) => {
              register(name).onChange(e);
              handleFileChange(e);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <svg
              className={`mx-auto h-12 w-12 mb-4 ${
                dragActive ? 'text-pink-400' : 'text-pink-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-300">
                {dragActive ? 'Drop your file here' : 'Drag and drop file here'}
              </p>
              <p className="text-sm text-gray-500">
                or click to browse
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border-2 border-green-500 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{uploadedFile.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm animate-fade-in flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error.message}</span>
        </p>
      )}
    </div>
  );
};

export default FileUpload;
