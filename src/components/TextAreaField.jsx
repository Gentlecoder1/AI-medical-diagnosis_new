import React from 'react';

const TextAreaField = ({
  label,
  name,
  placeholder,
  register,
  error,
  required = false,
  rows = 4,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
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
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          <span>{label}</span>
          {required && <span className="text-pink-400">*</span>}
        </div>
      </label>

      {/* Textarea */}
      <textarea
        id={name}
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-4 py-3 bg-gray-800 border-2 rounded-xl text-white placeholder-gray-500
          transition-all duration-200 resize-none text-base leading-relaxed
          ${error
            ? 'border-red-500 focus:border-red-400 focus:ring-red-400'
            : 'border-gray-600 focus:border-pink-400 focus:ring-pink-400'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
          hover:border-gray-500
        `}
      />

      {/* Error Message */}
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

export default TextAreaField;
