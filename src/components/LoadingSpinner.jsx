import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin`}>
          <svg
            className="w-full h-full text-pink-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <div className={`absolute inset-0 ${sizeClasses[size]} animate-ping opacity-20`}>
          <div className="w-full h-full bg-pink-400 rounded-full"></div>
        </div>
      </div>
      {text && (
        <p className="mt-2 text-sm font-medium text-gray-300 text-center animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
