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
  
  const authEmail = useUIAppSelector((state) => state.auth.profile.email);
  const authName = useUIAppSelector((state) => state.auth.profile.name);
  const authPhone = useUIAppSelector((state) => state.auth.profile.phone);
  
  const dispatch = useUIAppDispatch();
  const {toastSuccess, toastError} = useToast();
  const {data:session} = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  // Cargar regiones
  useEffect(() => {
    const loadRegions = async () => {
      if (session?.user?.access_token) {
        setIsLoadingRegions(true);
        try {
          const response = await getRegionsList(session.user.access_token);
          
          if (response.success && response.data) {
            setRegions(response.data);
          } else {
            toastError(response.message);
          }
        } catch (error) {
          toastError("Error al cargar las regiones");
        } finally {
          setIsLoadingRegions(false);
        }
      }
    };

    loadRegions();
  }, [session?.user?.access_token]);

  useEffect(()=>{
    setValue("fullName", authName || "" );
    setValue("telephone", authPhone || "" );
  },[session?.user]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Actualizar información personal
      const userProfile = await setProfileForm({
        token: session?.user?.access_token || "",
        fullName: data.fullName,
        telephone: data.telephone,
      });

      // Actualizar región si se seleccionó una región
      if (selectedRegion && session?.user?.access_token) {
        const regionResponse = await updateUserRegion(session.user.access_token, {
          regionId: selectedRegion
        });

        if (!regionResponse.success) {
          toastError(regionResponse.message);
          return;
        }
      }

      // Actualizamos el store con los nuevos datos
      dispatch(setName(data.fullName));
      dispatch(setPhone(data.telephone));
      
      toastSuccess("Perfil actualizado con éxito");
    } catch (error) {
      toastError("Error al actualizar perfil")
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onSubmit,
    errors,
    handleSubmit,
    register,
    isValid,
    authEmail,
    isLoading,
    regions,
    isLoadingRegions,
    selectedRegion,
    setSelectedRegion,
  };
}