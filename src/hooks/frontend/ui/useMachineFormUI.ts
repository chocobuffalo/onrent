"use client";
import { useEffect } from "react";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { toggleModal } from "@/libs/redux/features/ui/modalSlicer";
import useMachineForm from "@/hooks/backend/useMachineForm";

interface UseMachineFormUIProps {
  onCreated?: () => void;
}

export default function useMachineFormUI({ onCreated }: UseMachineFormUIProps = {}) {
  const dispatch = useUIAppDispatch();
  const locationState = useUIAppSelector((state) => state.filters.location);
  
  const backendHook = useMachineForm();

  // Sincronizar Redux con el formulario cuando cambie la ubicación
  useEffect(() => {
    if (locationState) {
      backendHook.setValue("location_info", locationState.label);
      backendHook.setValue("gps_lat", locationState.lat);
      backendHook.setValue("gps_lng", locationState.lon);
    }
  }, [locationState, backendHook.setValue]);

  // Handler que coordina submit backend + callbacks de UI
  const handleFormSubmit = async (data: any) => {
    try {
      await backendHook.submit(data);
      
      // Solo si el servidor respondió exitosamente, ejecutar callback
      if (onCreated) {
        onCreated();
      }
      
      dispatch(toggleModal());
      
      // Disparar evento para actualizar MachineTable
      window.dispatchEvent(new CustomEvent('machineryCreated'));
      
    } catch (error) {
      // NO cerrar modal ni ejecutar callback si hay error del servidor
      // El modal permanece abierto para que el usuario pueda corregir
    }
  };

  return {
    // Exponer todo del hook backend
    register: backendHook.register,
    handleSubmit: backendHook.handleSubmit,
    errors: backendHook.errors,
    isLoading: backendHook.isLoading,
    isValid: backendHook.isValid,
    watch: backendHook.watch,
    
    // Sobrescribir submit con la versión que maneja UI
    submit: handleFormSubmit,
  };
}