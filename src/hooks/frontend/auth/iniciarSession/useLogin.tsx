// src/hooks/frontend/auth/iniciarSession/useLogin.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { signIn, SignInResponse } from "next-auth/react";
import { useToast } from "@/hooks/frontend/ui/useToast";


interface LoginFormData {
  emailOrPhone: string;
  password: string;
}


const loginSchema = Yup.object({
  emailOrPhone: Yup.string()
    .required("El email o teléfono es requerido")
    .test("email-or-phone", "Formato de email o teléfono inválido", (value) => {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});


enum AuthError {
  CREDENTIALS_SIGNIN = "CredentialsSignin",
  ACCESS_DENIED = "AccessDenied", 
  VERIFICATION = "Verification",
  CALLBACK_ERROR = "Callback",
  DEFAULT = "Default"
}


const ERROR_MESSAGES: Record<AuthError, string> = {
  [AuthError.CREDENTIALS_SIGNIN]: "Email o contraseña incorrectos. Por favor, verifica tus datos e intenta nuevamente.",
  [AuthError.ACCESS_DENIED]: "Acceso denegado. Tu cuenta puede estar desactivada. Contacta a soporte.",
  [AuthError.VERIFICATION]: "Tu cuenta requiere verificación. Revisa tu email para activarla.",
  [AuthError.CALLBACK_ERROR]: "Error en la autenticación. Por favor, intenta de nuevo.",
  [AuthError.DEFAULT]: "No pudimos procesar tu solicitud. Verifica tu conexión e intenta de nuevo."
};

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { toastSuccess, toastError, toastInfo } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });


  const getErrorMessage = (error: string): string => {
    const authError = Object.values(AuthError).find(err => err === error);
    return authError ? ERROR_MESSAGES[authError] : ERROR_MESSAGES[AuthError.DEFAULT];
  };

  const extractUserName = (emailOrPhone: string): string => {
    if (emailOrPhone.includes('@')) {
      return emailOrPhone.split('@')[0];
    }
    return emailOrPhone;
  };

  
  const handleLoginSuccess = (emailOrPhone: string): void => {
    const userName = extractUserName(emailOrPhone);
    toastSuccess(`¡Bienvenido a OnRentX, ${userName}! Acceso concedido correctamente.`);

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };


  const handleLoginError = (error: string): void => {
    console.error("❌ Error al iniciar sesión:", error);
    const errorMessage = getErrorMessage(error);
    toastError(errorMessage);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      toastInfo("Verificando tus credenciales...");
      console.log('🔄 Intentando login con:', { email: data.emailOrPhone });
      
      const response: SignInResponse | undefined = await signIn("credentials", {
        redirect: false,
        email: data.emailOrPhone,
        password: data.password,
      });

      console.log('🔄 Respuesta de signIn:', response);

 
      if (!response) {
        toastError("Ocurrió un error inesperado. Nuestro equipo técnico ha sido notificado.");
        return;
      }

      if (response.error) {
        handleLoginError(response.error);
        return;
      }

      if (response.ok) {
        console.log("✅ Sesión iniciada correctamente");
        handleLoginSuccess(data.emailOrPhone);
        return;
      }

   
      toastError("Ocurrió un error inesperado. Nuestro equipo técnico ha sido notificado.");

    } catch (error) {
      console.error("❌ Error en el proceso de login:", error);
      toastError("Error de conexión con nuestros servidores. Verifica tu internet e intenta en unos momentos.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    errors,
    isValid,
    register,
    isLoading,
    handleSubmit,
    onSubmit,
  };
}