import React from 'react';

const FormSection = ({ title, children }) => (
  <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
    {title && (
      <h2 className="text-2xl font-semibold text-white text-center mb-6">
        {title}
      </h2>
    )}
    <div className="space-y-6">{children}</div>
  </div>
);

export default FormSection;
