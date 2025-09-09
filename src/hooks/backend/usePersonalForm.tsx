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
import { useToast } from "../frontend/ui/useToast";
import { setName, setPhone } from "@/libs/redux/features/auth/authSlicer";

const schema = Yup.object({
  fullName: Yup.string().required("Nombres y apellidos son requeridos"),
  telephone: Yup.string().required("Teléfono es requerido"),
});

export default function usePersonalForm() {
  const [isLoading, setIsLoading] = useState(false);
  const authEmail = useUIAppSelector((state) => state.auth.profile.email);
  const authName = useUIAppSelector((state) => state.auth.profile.name);
  const authPhone = useUIAppSelector((state) => state.auth.profile.phone);
  const dispatch = useUIAppDispatch();


  const {toastSuccess, toastError} = useToast()
  
  const {data:session} = useSession()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  useEffect(()=>{
    setValue("fullName", authName || "" );
    setValue("telephone", authPhone || "" );
  },[session?.user])


  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate an API call
      const userProfile = await setProfileForm({
        token: session?.user?.access_token || "",
        fullName: data.fullName,
        telephone: data.telephone,
      })
     //actualizamos el store con los nuevos datos
     dispatch(setName(data.fullName));
     dispatch(setPhone(data.telephone));
      toastSuccess("Perfil actualizado con éxito");
      console.log(userProfile," userProfile en usePersonalForm");
    } catch (error) {
      toastError("Error al actualizar perfil")
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Example return values
    onSubmit,
    errors,
    handleSubmit,
    register,
    isValid,
    authEmail,
    isLoading,
  };
}
