import React from "react";
import GradientButton from "../../atoms/GradientButton/GradientButton";

interface ActionSectionProps {
  buttonText?: string;
  onButtonClick?: () => void;
  footerText?: string;
  className?: string;
}

const ActionSection: React.FC<ActionSectionProps> = ({
  buttonText = "Continuar explorando",
  onButtonClick = () => (window.location.href = "/"),
  footerText = "📧 Recibirás la confirmación por email en breve",
  className = "",
}) => {
  return (
    <div className={`text-center ${className}`}>
      <GradientButton onClick={onButtonClick}>{buttonText}</GradientButton>

      <p className="text-sm font-futura-light text-slate-400 mt-6">
        {footerText}
      </p>
    </div>
  );
};

export default ActionSection;
