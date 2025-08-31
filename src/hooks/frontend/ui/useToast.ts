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
  const toastSuccessAction = (message:string,action:()=>void)=>{
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: "success-action-toast",
      onClose: action
    });
  }

  return {
    toastSuccess,
    toastError,
    toastInfo,
    toastWarning,
    toastSuccessAction
  };
}