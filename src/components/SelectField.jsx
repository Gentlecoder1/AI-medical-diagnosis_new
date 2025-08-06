import React from 'react';

const SelectField = ({
  label,
  name,
  options,
  placeholder = 'Select an option',
  register,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-white text-base font-medium"
      >
        {label}
        {required && <span className="text-pink-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          {...register(name)}
          className={`
            w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white appearance-none
            transition-all duration-200 min-h-[44px] text-base
            focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-black
            ${error
              ? 'border-red-500 focus:border-red-400'
              : 'border-gray-600 focus:border-pink-400 hover:border-gray-500'
            }
            ${className}
          `}
        >
          <option value="" className="text-gray-500 bg-gray-800">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-white bg-gray-800">
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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

export default SelectField;
