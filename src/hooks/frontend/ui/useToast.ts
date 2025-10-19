import { toast } from "react-toastify";

export function useToast() {
  const toastSuccess = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000, // ✅ CAMBIO: De 5000 a 2000 (2 segundos)
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false, // ✅ CAMBIO: De true a false para que se cierre automático
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
      autoClose: 3000, // ✅ CAMBIO: De 5000 a 3000 (3 segundos antes de redirigir)
      hideProgressBar: false,
      closeOnClick: false, // ✅ CAMBIO: No permitir cerrar con click para que complete la redirección
      pauseOnHover: false, // ✅ CAMBIO: De true a false
      draggable: false, // ✅ CAMBIO: De true a false
      toastId: "success-action-toast",
      onClose: action
    });
  }

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
  
  const toastCriticalAction = (message: string,action:()=>void) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true, 
      pauseOnHover: true,
      draggable: false,
      toastId: "critical-toast",
      style: {
        fontSize: "14px",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      },
      onClose: action
    });
  };

  return {
    toastSuccess,
    toastError,
    toastInfo,
    toastWarning,
    toastSuccessAction,
    toastCritical,
    toastCriticalAction
  };
}
