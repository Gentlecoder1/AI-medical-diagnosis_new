import React from 'react';

const Header = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-pink-400 leading-tight mb-6">
      {title}
    </h1>
    <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
      {subtitle}
    </p>
  </div>
);

export default Header;
