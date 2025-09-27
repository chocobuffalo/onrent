// src/hooks/frontend/auth/iniciarSession/useLogin.ts
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

interface ApiLoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: {
    user_id: number;
    email: string;
    name: string;
    role: string;
    odoo_partner_id: number;
  };
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

  // Función para obtener la ubicación actual del usuario
  const getCurrentLocation = (): Promise<{latitude: number, longitude: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 0, longitude: 0 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Error obteniendo geolocalización:", error);
          // Usar coordenadas por defecto si falla
          resolve({ latitude: 19.4326, longitude: -99.1332 });
        },
        { timeout: 10000 }
      );
    });
  };

  // Función para manejar el login con la API de ubicaciones (en paralelo)
  const handleLocationApiLogin = async (data: LoginFormData) => {
    try {
      // 1. Obtener ubicación actual
      const location = await getCurrentLocation();
      console.log("📍 Ubicación obtenida:", location);

      // 2. Login con API de ubicaciones
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.emailOrPhone,
          password: data.password,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      if (!apiResponse.ok) {
        console.warn("⚠️ Login con API de ubicaciones falló, continuando con NextAuth");
        return;
      }

      const apiData: ApiLoginResponse = await apiResponse.json();
      console.log("✅ API de ubicaciones login exitoso:", apiData.user);

      // 3. Guardar datos para el sistema de ubicaciones
      localStorage.setItem("api_access_token", apiData.access_token);
      localStorage.setItem("api_user_data", JSON.stringify(apiData.user));

      // 4. Enviar ubicación inicial a DynamoDB
      try {
        await fetch("/api/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceId: apiData.user.user_id.toString(),
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        });
        console.log("📡 Ubicación inicial enviada a DynamoDB");
      } catch (locationError) {
        console.warn("⚠️ Error enviando ubicación inicial:", locationError);
      }

    } catch (error) {
      console.warn("⚠️ Error en login de API de ubicaciones:", error);
      // No bloquear el login principal por este error
    }
  };
  
  const handleLoginSuccess = (emailOrPhone: string): void => {
    const userName = extractUserName(emailOrPhone);
    toastSuccess(`¡Bienvenido a OnRentX, ${userName}! Acceso concedido correctamente.`);

    // Redirigir según el rol si hay datos de la API de ubicaciones
    const apiUserData = localStorage.getItem("api_user_data");
    let redirectPath = "/catalogo"; // Por defecto

    if (apiUserData) {
      try {
        const userData = JSON.parse(apiUserData);
        const userRole = userData.role;

        switch (userRole) {
          case "operador":
            redirectPath = "/operator-navigation";
            break;
          case "cliente":
          case "cliente_proveedor":
            redirectPath = "/dashboard";
            break;
          case "proveedor":
            redirectPath = "/dashboard/fleet";
            break;
          default:
            redirectPath = "/catalogo";
        }

        console.log(`🚀 Redirigiendo a ${redirectPath} para rol: ${userRole}`);
      } catch (error) {
        console.warn("Error parseando datos de usuario, usando redirección por defecto");
      }
    }

    setTimeout(() => {
      window.location.href = redirectPath;
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
      
      // Ejecutar login de ubicaciones en paralelo (no bloqueante)
      handleLocationApiLogin(data).catch(error => {
        console.warn("Login de API de ubicaciones falló:", error);
      });

      // Login principal con NextAuth
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