"use client";

import { useEffect } from "react";
import { useUIAppSelector } from "@/libs/redux/hooks";
import useOperatorForm from "@/hooks/backend/useOperatorForm";

interface UseOperatorFormUIProps {
  onCreated?: () => void;
}

export default function useOperatorFormUI({ onCreated }: UseOperatorFormUIProps = {}) {
  const locationState = useUIAppSelector((state) => state.filters.location);
  
  const backendHook = useOperatorForm({ onCreated });

  // Sincronizar dirección con Redux location state
  useEffect(() => {
    if (locationState && locationState.label) {
      backendHook.setValue("address", locationState.label);
      backendHook.setValue("gps_lat", locationState.lat);
      backendHook.setValue("gps_lng", locationState.lon);
    }
  }, [locationState, backendHook]);

  const handleFormSubmit = async (data: any) => {
    try {
      // ✅ Llamar al submit del backend
      await backendHook.submit(data);
      
      // ✅ Cerrar el modal llamando al callback
      if (onCreated) {
        onCreated();
      }
      
      // ✅ Disparar evento para refrescar la tabla
      window.dispatchEvent(new CustomEvent('operatorCreated'));
      
    } catch (error) {
      // Modal permanece abierto si hay error
      console.error("Error en submit:", error);
    }
  };

  return {
    register: backendHook.register,
    handleSubmit: backendHook.handleSubmit,
    errors: backendHook.errors,
    isLoading: backendHook.isLoading,
    isValid: backendHook.isValid,
    submit: handleFormSubmit,
    setValue: backendHook.setValue,
  };
}
