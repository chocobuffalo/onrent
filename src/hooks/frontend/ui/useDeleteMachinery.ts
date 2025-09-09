"use client";

import { useState } from "react";
import { MachineryResponse } from "@/types/machinary";
import { toast } from "react-toastify";
import { useConfirmation } from "@/hooks/frontend/ui/useConfirmation";

interface UseDeleteMachineryProps {
  onSuccess?: (deletedItem: MachineryResponse) => Promise<void>;
}

export default function useDeleteMachinery({ onSuccess }: UseDeleteMachineryProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { confirm, modalProps, setModalLoading } = useConfirmation();

  const confirmAndDelete = async (item: MachineryResponse): Promise<void> => {
    try {
      // Awaitar la confirmación del usuario
      const userConfirmed = await confirm({
        title: 'Eliminar Maquinaria',
        message: `¿Está seguro de eliminar "${item.name}"? Esta acción no se puede deshacer.`,
        confirmText: 'ELIMINAR',
        cancelText: 'CANCELAR',
        variant: 'danger'
      });
      
      if (!userConfirmed) {
        return;
      }

      // Mostrar loading en el modal y estado local
      setModalLoading(true);
      setIsLoading(true);

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Guardar eliminación en localStorage para persistencia
      const deletedIds = JSON.parse(localStorage.getItem('deletedMachineries') || '[]');
      const updatedDeletedIds = [...deletedIds, item.id];
      localStorage.setItem('deletedMachineries', JSON.stringify(updatedDeletedIds));
      
      toast.success(`Maquinaria "${item.name}" eliminada exitosamente`);
      
      // Ejecutar callback para eliminar del estado local
      if (onSuccess && typeof onSuccess === 'function') {
        await onSuccess(item);
      }
      
    } catch (error: any) {
      toast.error("Error al eliminar la maquinaria");
    } finally {
      setModalLoading(false);
      setIsLoading(false);
    }
  };

  return {
    confirmAndDelete,
    isLoading,
    modalProps // Props para el modal que debe renderizarse en el componente padre
  };
}