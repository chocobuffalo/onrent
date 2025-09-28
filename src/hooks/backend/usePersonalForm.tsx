/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { useSession } from "next-auth/react";
import setProfileForm from "@/services/setProfileForm";
import { getRegionsList, updateUserRegion } from "@/services/getRegions";
import getProfile from "@/services/getProfile";
import { useToast } from "../frontend/ui/useToast";
import { setName, setPhone } from "@/libs/redux/features/auth/authSlicer";
import { Region } from "@/types/profile";

const schema = Yup.object({
  fullName: Yup.string().required("Nombres y apellidos son requeridos"),
  telephone: Yup.string().required("Teléfono es requerido"),
  regionId: Yup.number().nullable(),
});

export default function usePersonalForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [initialValues, setInitialValues] = useState({
    fullName: "",
    telephone: "",
    regionId: null as number | null,
  });
  
  const dispatch = useUIAppDispatch();
  const {toastSuccess, toastError} = useToast();
  const {data:session} = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  // Función para sincronizar datos del perfil con el formulario
  const syncProfileToForm = (profileData: any) => {
    const fullName = profileData.name || "";
    const telephone = profileData.phone || "";
    const regionId = profileData?.region?.id || null;

    setValue("fullName", fullName);
    setValue("telephone", telephone);
    setSelectedRegion(regionId);
    
    // Actualizar valores iniciales para comparación
    setInitialValues({
      fullName,
      telephone,
      regionId,
    });

    // Actualizar Redux store
    dispatch(setName(fullName));
    dispatch(setPhone(telephone));
  };

  // Cargar regiones y perfil del usuario
  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.access_token) return;

      setIsLoadingRegions(true);
      try {
        // Cargar regiones
        const regionsResponse = await getRegionsList(session.user.access_token);
        if (regionsResponse.success && regionsResponse.data) {
          setRegions(regionsResponse.data);
        } else {
          toastError(regionsResponse.message);
        }

        // Cargar perfil completo del usuario
        const profileResponse = await getProfile(session.user.access_token);
        if (profileResponse) {
          syncProfileToForm(profileResponse);
        }

      } catch (error) {
        toastError("Error al cargar la información");
      } finally {
        setIsLoadingRegions(false);
      }
    };

    loadData();
  }, [session?.user?.access_token]);

  const onSubmit = async (data: any) => {
    if (!session?.user?.access_token) return;

    setIsLoading(true);
    try {
      const currentValues = {
        fullName: data.fullName,
        telephone: data.telephone,
        regionId: selectedRegion,
      };

      // Verificar qué cambió
      const nameChanged = currentValues.fullName !== initialValues.fullName;
      const phoneChanged = currentValues.telephone !== initialValues.telephone;
      const regionChanged = currentValues.regionId !== initialValues.regionId;

      // Actualizar información personal (nombre y teléfono) si alguno cambió
      if (nameChanged || phoneChanged) {
        const userProfile = await setProfileForm({
          token: session.user.access_token,
          fullName: currentValues.fullName,
          telephone: currentValues.telephone,
        });
        console.log("Información personal actualizada:", userProfile);
      }

      // Actualizar región solo si cambió o si se actualizó info personal y hay región seleccionada
      if (regionChanged || ((nameChanged || phoneChanged) && selectedRegion !== null)) {
        if (selectedRegion !== null) {
          const regionResponse = await updateUserRegion(session.user.access_token, {
            regionId: selectedRegion
          });

          if (!regionResponse.success) {
            toastError(regionResponse.message);
            return;
          }
          console.log("Región actualizada:", regionResponse);
        }
      }

      // Recargar perfil para mantener sincronización
      const updatedProfile = await getProfile(session.user.access_token);
      if (updatedProfile) {
        syncProfileToForm(updatedProfile);
      }
      
      toastSuccess("Perfil actualizado con éxito");
    } catch (error) {
      toastError("Error al actualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si hay cambios pendientes
  const hasChanges = () => {
    const currentValues = {
      fullName: watch("fullName") || "",
      telephone: watch("telephone") || "",
      regionId: selectedRegion,
    };

    return (
      currentValues.fullName !== initialValues.fullName ||
      currentValues.telephone !== initialValues.telephone ||
      currentValues.regionId !== initialValues.regionId
    );
  };

  return {
    onSubmit,
    errors,
    handleSubmit,
    register,
    isValid,
    authEmail: session?.user?.email || "",
    isLoading,
    regions,
    isLoadingRegions,
    selectedRegion,
    setSelectedRegion,
    hasChanges,
  };
}