import React from 'react';

const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  register, 
  error, 
  required = false,
  className = '' 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label
        htmlFor={name}
        className="block text-white text-base font-medium"
      >
        {label}
        {required && <span className="text-pink-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`
            w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white appearance-none
            transition-all duration-200 min-h-[48px] text-base
            focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-black
            ${error
              ? 'border-red-500 focus:border-red-400'
              : 'border-gray-600 focus:border-pink-400 hover:border-gray-500'
            }
          `}
        />
      </div>

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

export default InputField;
