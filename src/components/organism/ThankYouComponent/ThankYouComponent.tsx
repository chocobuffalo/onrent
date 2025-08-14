"use client";

import React from "react";
import { useThankYouPage } from "../../../hooks/backend/useThankYouPage";
import ContentContainer from "../ContentContainer/ContentContainer";
import SuccessMessage from "../../molecule/SuccessMessage/SuccessMessage";
import Separator from "../../atoms/Separator/Separator";
import ActionSection from "../../molecule/ActionSection/ActionSection";

interface ThankYouComponentProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const ThankYouComponent: React.FC<ThankYouComponentProps> = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
}) => {
  const { isLoading } = useThankYouPage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-slate-200 to-slate-300 rounded-full opacity-15 blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full">
        <ContentContainer>
          <SuccessMessage title={title} subtitle={subtitle} className="mb-8" />
          <Separator className="mb-8" />
          <ActionSection
            buttonText={buttonText}
            onButtonClick={onButtonClick}
          />
        </ContentContainer>
      </div>
    </div>
  );
};

export default ThankYouComponent;