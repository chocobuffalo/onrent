import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/hooks/frontend/ui/useToast";

export default function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const { toastSuccess, toastInfo, toastError } = useToast();
  const { data: session } = useSession();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Iniciando proceso de logout');
      
      const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Usuario';
      toastInfo(`Cerrando tu sesión, ${userName}. Gracias por usar OnRentX.`);
      
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
      
      console.log('✅ Logout exitoso');
      
  
      toastSuccess("Sesión cerrada con éxito. ¡Te esperamos pronto de vuelta!");
      
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      

      toastError("No pudimos cerrar tu sesión correctamente. Por seguridad, cierra tu navegador.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogout,
    isLoading,
  };
}