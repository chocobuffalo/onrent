// components/atoms/Button/ActionButton.tsx

import React from 'react';
import { ImSpinner8 } from "react-icons/im"; // Asegúrate de tener react-icons instalado

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  // Puedes añadir más props como className si usas estilos más específicos
}

const ActionButton = ({ children, onClick, isLoading, disabled }: ActionButtonProps) => {
  return (
    <button 
      className="btn btn-primary" // Usa tus clases de estilo aquí
      onClick={onClick} 
      disabled={disabled}
    >
      {isLoading ? (
        <ImSpinner8
          color="#ffffff"
          size={20}
          className="animate-spin"
        />
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
};

export default ActionButton;