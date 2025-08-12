import React from 'react';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({ 
  children, 
  onClick, 
  className = ''
}) => {
  return (
    <button 
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl font-futura-medium
        bg-gradient-to-r from-orange-500 to-orange-600 text-white
        shadow-xl hover:shadow-2xl transform hover:-translate-y-1 
        transition-all duration-300 w-full md:w-auto px-10 py-4 text-lg
        focus:outline-none focus:ring-4 focus:ring-orange-200
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
};

export default GradientButton;