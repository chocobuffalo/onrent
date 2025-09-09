"use client";
import useEditMachineForm from "@/hooks/backend/useEditMachineForm";
import { MachineryResponse } from "@/types/machinary";

interface UseEditMachineFormUIProps {
  editData: MachineryResponse;
  onSuccess?: () => Promise<void>;
}

export default function useEditMachineFormUI({ editData, onSuccess }: UseEditMachineFormUIProps) {
  const backendHook = useEditMachineForm(editData);

  // Handler que coordina submit backend + callbacks de UI
  const handleFormSubmit = async (data: any) => {
    try {
      await backendHook.submit(data);
      
      // Solo si el servidor respondió exitosamente, ejecutar callback
      if (onSuccess && typeof onSuccess === 'function') {
        await onSuccess();
      }
    } catch (error) {
      // Error ya manejado por el hook backend
    }
  };

  // Handler que actualiza solo el formulario (NO Redux)
  const handleLocationChange = (value: string) => {
    backendHook.setValue("location_info", value, { shouldValidate: true });
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
    handleFileChange: backendHook.handleFileChange,
    
    // Funciones de coordinación UI
    submit: handleFormSubmit,
    handleLocationChange,
  };
}