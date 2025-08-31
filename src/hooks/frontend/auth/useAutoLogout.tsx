// src/hooks/frontend/auth/useAutoLogout.tsx
import { useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { useUIAppDispatch, useUIAppSelector } from '@/libs/redux/hooks';
import { forceLogout } from '@/libs/redux/features/auth/authSlicer';
import { useToast } from '@/hooks/frontend/ui/useToast';

export default function useAutoLogout() {
  const dispatch = useUIAppDispatch();
  const profile = useUIAppSelector(state => state.auth.profile);
  const { toastCritical } = useToast();
  const logoutInProgress = useRef(false); // Prevenir múltiples ejecuciones

  useEffect(() => {
    // Función global para disparar logout automático
    if (typeof window !== 'undefined') {
      window.triggerAutoLogout = async () => {
        // Prevenir múltiples ejecuciones simultáneas
        if (logoutInProgress.current) {
          console.log('Logout ya en progreso, ignorando...');
          return;
        }
        
        logoutInProgress.current = true;
        
        const userName = profile?.name || profile?.email?.split('@')[0] || 'Usuario';
        
        console.log('Token expirado - ejecutando logout automático');
        
        // Detectar contexto actual para ajustar tiempo y mensaje
        const currentPath = window.location.pathname;
        const isInForm = currentPath.includes('/crear') || 
                        currentPath.includes('/editar') || 
                        currentPath.includes('/nuevo') ||
                        document.querySelector('form'); // Detecta cualquier formulario
        
        const timeoutDelay = isInForm ? 8000 : 2000; // 8s para formularios, 2s para navegación
        
        let message;
        if (isInForm) {
          message = `${userName}, tu sesión ha expirado por seguridad.
          
⚠️ **CRÍTICO**: Tienes 8 segundos para hacer clic en "Guardar" o "Guardar borrador".

🔄 Redirigiendo al login...`;
        } else {
          message = `${userName}, sesión expirada. Redirigiendo al login...`;
        }
        
      
        toastCritical(message);
        
        // Limpiar estado de Redux inmediatamente
        dispatch(forceLogout());

        // Ejecutar logout con tiempo inteligente
        setTimeout(async () => {
          try {
            console.log('Iniciando proceso de logout...');
            await signOut({
              callbackUrl: '/iniciar-session',
              redirect: true,
            });
          } catch (error) {
            console.error('Error en logout automático:', error);
            // Fallback más rápido: redirect manual inmediato
            window.location.replace('/iniciar-session');
          } finally {
            logoutInProgress.current = false;
          }
        }, timeoutDelay);
      };
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        delete window.triggerAutoLogout;
      }
      logoutInProgress.current = false;
    };
  }, [dispatch, profile?.name, profile?.email, toastCritical]);
}