import React, { useState, useRef } from "react";

const FileUpload = ({
  label,
  name,
  register,
  error,
  required = false,
  accept = "image/*",
  className = "",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

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
          files: e.dataTransfer.files,
        },
      };
      register(name).onChange(event);
    }
  };

  const handleFileChange = (e) => {
    console.log('handleFileChange called with:', e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log('Setting uploaded file:', file.name);
      setUploadedFile(file);
      
      // Ensure the form knows about the file change
      const registerProps = register(name);
      if (registerProps.onChange) {
        registerProps.onChange(e);
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    // Clear the file input properly using ref
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      // Trigger form update for removal
      const registerProps = register(name);
      if (registerProps.onChange) {
        registerProps.onChange({ target: { name, files: null } });
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{label}</span>
          {required && <span className="text-red-400">*</span>}
        </div>
      </label>

      {/* Medical Image Guidelines */}
      <div className="mb-4 p-4 bg-blue-900/20 border border-blue-600/50 rounded-lg">
        <div className="flex items-center mb-3">
          <svg
            className="w-5 h-5 text-blue-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm font-semibold text-blue-300">
            AI-Enhanced Medical Image Analysis
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-green-900/30 p-3 rounded-md border border-green-600/50">
            <p className="text-green-300 font-medium mb-2">
              ✅ Accepted Medical Images:
            </p>
            <ul className="text-green-200 space-y-1">
              <li>• Mammogram scans</li>
              <li>• Breast ultrasound images</li>
              <li>• MRI breast imaging</li>
              <li>• Clinical examination photos</li>
              <li>• Medical reports with imaging</li>
            </ul>
          </div>
          <div className="bg-red-900/30 p-3 rounded-md border border-red-600/50">
            <p className="text-red-300 font-medium mb-2">
              ❌ Will Be Rejected:
            </p>
            <ul className="text-red-200 space-y-1">
              <li>• Personal/casual photographs</li>
              <li>• Selfies or portraits</li>
              <li>• Non-medical content</li>
              <li>• Images of other body parts</li>
              <li>• Screenshots or random images</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-600/50 rounded">
          <p className="text-yellow-200 text-xs">
            <strong>AI Detection:</strong> Our system will automatically
            validate uploaded images and ensure they are appropriate for medical
            analysis.
          </p>
        </div>
      </div>

      {!uploadedFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer
            ${
              dragActive
                ? "border-pink-400 bg-pink-400/10"
                : error
                ? "border-red-400 bg-red-400/10"
                : "border-pink-500 bg-gray-800 hover:border-pink-400 hover:bg-gray-700"
            }
            ${className}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={(e) => {
            // Prevent double-triggering by checking if click is on the input itself
            if (e.target.type !== 'file') {
              e.preventDefault();
              e.stopPropagation();
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }
          }}
        >
          <input
            ref={fileInputRef}
            id={name}
            type="file"
            accept={accept}
            {...register(name)}
            onChange={(e) => {
              console.log('File input onChange triggered:', e.target.files);
              // Stop propagation to prevent bubbling
              e.stopPropagation();
              
              // Process the file selection
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange(e);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <svg
              className={`mx-auto h-12 w-12 mb-4 ${
                dragActive ? "text-pink-400" : "text-pink-500"
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

            <div className="text-center">
              <p className="text-lg font-medium text-gray-200 mb-2">
                {dragActive
                  ? "Drop your medical image here"
                  : "Upload Medical Image"}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Drag and drop or click to select
              </p>
              <div className="text-xs text-gray-500">
                <p>Supported formats: JPG, PNG, DICOM</p>
                <p>Max size: 10MB</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-pink-500 rounded-xl p-6 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-10 h-10 text-pink-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-lg">
                  {uploadedFile.name}
                </p>
                <p className="text-gray-400 text-sm">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="flex-shrink-0 p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4 p-3 bg-green-900/30 border border-green-600/50 rounded-md">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-green-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4"
                />
              </svg>
              <p className="text-green-300 text-sm font-medium">
                Image ready for AI analysis
              </p>
            </div>
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
