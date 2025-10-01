import axios from 'axios';
import { CreateAxiosInstanceOptions } from '@/types/axios';

// Variable global para controlar si ya se está procesando un logout
let isLoggingOut = false;

const createAxiosInstance = async (options: CreateAxiosInstanceOptions = {}) => {
  const instance = axios.create({
    baseURL: options.baseURL || process.env.NEXT_PUBLIC_API_URL_ORIGIN,
    timeout: options.timeout || 30000,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Request interceptor - obtener token de Redux
  instance.interceptors.request.use(
    async (config: any) => {
      try {
        // Verificar que window existe (SSR safety)
        if (typeof window === 'undefined') {
          return config;
        }
        
        // Obtener token del store de Redux (definido en Providers.tsx)
        const store = (window as any)?.store;
        
        if (store) {
          const state = store.getState();
          const authState = state?.auth;
          
          if (authState?.profile?.token) {
            if (!config.headers) {
              config.headers = {};
            }
            config.headers.Authorization = `Bearer ${authState.profile.token}`;
          }
        }
        
        return config;
      } catch (error) {
        console.error("Error obteniendo token para request:", error);
        return config;
      }
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - manejar logout cuando token expire
  instance.interceptors.response.use(
    (response: any) => {
      return response;
    },
    async (error: any) => {
      // Solo manejar error 401 (token expirado) una vez
      if (error.response?.status === 401 && !isLoggingOut) {
        // Prevenir múltiples logout simultáneos
        isLoggingOut = true;
        
        try {
          // Disparar función global para logout automático
          if (typeof window !== 'undefined' && (window as any).triggerAutoLogout) {
            (window as any).triggerAutoLogout();
          }
        } catch (logoutError) {
          console.error("Error dispatching logout automático:", logoutError);
        }
        
        // Resetear flag después de un tiempo
        setTimeout(() => {
          isLoggingOut = false;
        }, 3000);
      }

      return Promise.reject(error);
    }
  );
  
  return instance;
};

export default createAxiosInstance;