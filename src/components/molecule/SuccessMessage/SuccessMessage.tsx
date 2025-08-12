import React from "react";
import SuccessIcon from "../../atoms/SuccessIcon/SuccessIcon";

interface SuccessMessageProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title = "¡Gracias por tu compra!",
  subtitle = "Tu pedido ha sido procesado exitosamente. Nos comunicaremos contigo muy pronto.",
  className = "",
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 rounded-lg mb-4">
          <span className="text-white font-futura-bold text-lg">OR</span>
        </div>
      </div>

      <SuccessIcon className="mb-8" />

      <h1 className="text-4xl md:text-5xl font-futura-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent leading-tight mb-6">
        {title.includes("compra") ? (
          <>
            ¡Gracias por
            <br />
            tu compra!
          </>
        ) : (
          title
        )}
      </h1>

      <p className="text-lg md:text-xl font-futura-medium text-slate-600 leading-relaxed mb-0">
        {subtitle.split(".")[0]}.
      </p>
      <p className="text-base font-futura-light text-slate-500 mt-2">
        {subtitle.split(".").slice(1).join(".").trim()}
      </p>
    </div>
  );
};

export default SuccessMessage;
