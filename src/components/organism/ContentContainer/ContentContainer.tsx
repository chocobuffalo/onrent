import React from "react";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`
      bg-white/80 
      backdrop-blur-xl 
      rounded-3xl 
      shadow-2xl 
      border border-slate-200/50 
      p-8 
      max-w-lg 
      w-full 
      mx-auto
      ${className}
    `}
    >
      {children}
    </div>
  );
};

export default ContentContainer;
