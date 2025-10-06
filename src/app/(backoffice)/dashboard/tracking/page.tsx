"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ClientTrackingView from "@/components/molecule/tracking/ClientTrackingView";
import ProviderTrackingView from "@/components/molecule/tracking/ProviderTrackingView";

const TrackingPage = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Función helper para decodificar JWT
  const decodeJWT = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decodificando JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    let userData: any = null;

    // Obtener token (mismo patrón que usan otros componentes)
    const nextAuthToken = (session as any)?.accessToken || (session as any)?.user?.accessToken;
    const localStorageToken = localStorage.getItem("api_access_token");
    const token = nextAuthToken || localStorageToken;

    if (token) {
      // Decodificar JWT para obtener user_id, role, etc.
      const decodedToken = decodeJWT(token);
      
      if (decodedToken) {
        userData = {
          user_id: decodedToken.user_id,
          name: decodedToken.name,
          email: decodedToken.email,
          role: decodedToken.role,
          access_token: token,
        };
        console.log("✅ Usuario desde JWT decodificado:", userData);
        
        // Guardar en localStorage para otros componentes
        localStorage.setItem("api_user_data", JSON.stringify(userData));
        localStorage.setItem("api_access_token", token);
      }
    }
    
    // Fallback: intentar desde localStorage
    if (!userData) {
      const apiUserData = localStorage.getItem("api_user_data");
      if (apiUserData) {
        try {
          userData = JSON.parse(apiUserData);
          console.log("✅ Usuario desde localStorage:", userData);
        } catch (error) {
          console.error("❌ Error parseando api_user_data:", error);
        }
      }
    }

    if (userData) {
      console.log("🔍 Rol detectado:", userData?.role);
      setUserData(userData);
    } else {
      console.warn("⚠️ No se pudo obtener datos del usuario");
    }
    
    setIsLoadingUser(false);
  }, [session, status]);

  // Estado de carga inicial
  if (status === "loading" || isLoadingUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cargando módulo de seguimiento...
          </h3>
          <p className="text-gray-600">
            Detectando perfil de usuario
          </p>
        </div>
      </div>
    );
  }

  // Detectar rol del usuario con múltiples variantes
  const userRole = userData?.role?.toLowerCase()?.trim();
  const isClient = 
    userRole === 'client' || 
    userRole === 'cliente' ||
    userRole === 'customer' ||
    userData?.user_type?.toLowerCase() === 'client' ||
    userData?.user_type?.toLowerCase() === 'cliente';
  
  console.log("🎯 Vista a renderizar:", isClient ? "ClientTrackingView" : "ProviderTrackingView");
  console.log("🎯 Rol normalizado:", userRole);

  // Renderizar vista según rol
  if (isClient) {
    return <ClientTrackingView />;
  }

  return <ProviderTrackingView />;
};

export default TrackingPage;