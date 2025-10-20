"use client";

import useEditOperatorForm from "@/hooks/backend/useEditOperatorForm";
import { OperatorResponse } from "@/types/operator";

interface UseEditOperatorFormUIProps {
  editData: OperatorResponse;
  onSuccess?: () => Promise<void>;
}

export default function useEditOperatorFormUI({ editData, onSuccess }: UseEditOperatorFormUIProps) {
  const backendHook = useEditOperatorForm(editData);

  // Handler que coordina submit backend + callbacks de UI
  const handleFormSubmit = async (data: any) => {
    try {
      const success = await backendHook.submit(data);
      
      // Solo si el servidor respondió exitosamente, ejecutar callback
      if (success && onSuccess && typeof onSuccess === 'function') {
        await onSuccess();
      }
    } catch (error) {
      // Error ya manejado por el hook backend
    }
  };

  // ✅ Handler para actualizar dirección desde EditFilterInput
  const handleLocationChange = (value: string, coordinates?: { lat: number; lng: number }) => {
    backendHook.setValue("address", value, { shouldValidate: true });
    
    if (coordinates) {
      backendHook.setValue("gps_lat", coordinates.lat);
      backendHook.setValue("gps_lng", coordinates.lng);
    }
  };

  return {
    // Exponer todo del hook backend
    register: backendHook.register,
    handleSubmit: backendHook.handleSubmit,
    errors: backendHook.errors,
    isLoading: backendHook.isLoading,
    isValid: backendHook.isValid,
    setValue: backendHook.setValue,
    watch: backendHook.watch,
    
    // Funciones de coordinación UI
    submit: handleFormSubmit,
    handleLocationChange, // ✅ Exponer handler de ubicación
  };
}
