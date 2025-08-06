import React from 'react';

const ToggleButton = ({ 
  label, 
  name, 
  value, 
  selectedValue, 
  onChange, 
  options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ],
  error,
  required = false,
  className = ''
}) => {
  const handleToggle = (optionValue) => {
    onChange(optionValue);
  };

  return (
    <div className={`py-4 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        {/* Label */}
        <label className="text-white text-xl font-semibold flex-1">
          {label}
          {required && <span className="text-pink-400 ml-1">*</span>}
        </label>

        {/* Toggle Buttons */}
        <div className="flex space-x-3 justify-center lg:justify-end">
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            const isNo = option.value === 'No' || option.value === 'no' || option.value === false;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggle(option.value)}
                className={`
                  relative px-6 py-3 rounded-xl font-semibold text-lg
                  transition-all duration-200 min-w-[100px] border-2
                  focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2
                  focus:ring-offset-black min-h-[48px]
                  ${isSelected
                    ? isNo
                      ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-500/25'
                      : 'bg-gray-600 text-white border-gray-600 shadow-lg shadow-gray-600/25'
                    : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-500 hover:text-gray-300'
                  }
                  ${isSelected && !isNo ? 'hover:bg-gray-700 hover:border-gray-700' : ''}
                  ${isSelected && isNo ? 'hover:bg-pink-600 hover:border-pink-600' : ''}
                  active:scale-95 transform touch-manipulation
                `}
              >
                {option.label}

                {/* Selection indicator */}
                {isSelected && (
                  <div className={`
                    absolute -top-1 -right-1 w-4 h-4 rounded-full
                    ${isNo ? 'bg-pink-400' : 'bg-gray-400'}
                    animate-pulse
                  `} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm mt-3 animate-fade-in">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default ToggleButton;
