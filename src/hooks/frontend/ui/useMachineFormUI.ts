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

  useEffect(() => {
    if (locationState && locationState.label) {
      backendHook.setValue("location_info", locationState.label);
      backendHook.setValue("gps_lat", locationState.lat);
      backendHook.setValue("gps_lng", locationState.lon);
      backendHook.setLocationError(false);
    } else {
      backendHook.setValue("location_info", "");
      backendHook.setValue("gps_lat", undefined);
      backendHook.setValue("gps_lng", undefined);
    }
  }, [locationState]);

  const handleFormSubmit = async (data: any) => {
    try {
      await backendHook.submit(data);
      
      if (onCreated) {
        onCreated();
      }
      
      dispatch(toggleModal());
      window.dispatchEvent(new CustomEvent('machineryCreated'));
      
    } catch (error) {
      // Modal permanece abierto
    }
  };

  return {
    register: backendHook.register,
    handleSubmit: backendHook.handleSubmit,
    errors: backendHook.errors,
    isLoading: backendHook.isLoading,
    isValid: backendHook.isValid,
    watch: backendHook.watch,
    submit: handleFormSubmit,
    locationError: backendHook.locationError,
    setLocationError: backendHook.setLocationError,
  };
}
