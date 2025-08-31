// src/hooks/frontend/ui/useToast.ts
import { toast } from "react-toastify";

export function useToast() {
  const toastSuccess = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: "success-toast",
    });
  };

  const toastError = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: "error-toast",
    });
  };

  const toastInfo = (message: string) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: "info-toast",
    });
  };

  const toastWarning = (message: string) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: "warning-toast",
    });
  };

  // Toast específico para notificaciones críticas como expiración de sesión
  const toastCritical = (message: string) => {
    toast.warning(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false, 
      pauseOnHover: true,
      draggable: false,
      toastId: "critical-toast",
      style: {
        fontSize: "14px",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      }
    });
  };

  return {
    toastSuccess,
    toastError,
    toastInfo,
    toastWarning,
    toastCritical,
  };
}