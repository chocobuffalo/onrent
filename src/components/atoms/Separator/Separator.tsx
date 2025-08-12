import React from 'react';

interface SeparatorProps {
  className?: string;
}

const Separator: React.FC<SeparatorProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-24"></div>
      <div className="mx-4 w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-24"></div>
    </div>
  );
};

export default Separator;