import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessIconProps {
  className?: string;
}

const SuccessIcon: React.FC<SuccessIconProps> = ({ className = '' }) => {
  return (
    <div className={`
      w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg
      bg-gradient-to-br from-orange-400 to-orange-500 
      transform hover:scale-105 transition-transform duration-300
      ${className}
    `}>
      <CheckCircle className="w-12 h-12 text-white" />
    </div>
  );
};

export default SuccessIcon;