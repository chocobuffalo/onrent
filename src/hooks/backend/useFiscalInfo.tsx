/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
//mport { useUIAppDispatch } from "@/libs/redux/hooks";
import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { setFiscalInfo } from "@/services/setFiscalInfo";
import { setDireccionFiscal, setRazonSocial, setRFC } from "@/libs/redux/features/auth/authSlicer";
import { useToast } from "../frontend/ui/useToast";

const schema = Yup.object({
  rfc: Yup.string(),
  razon_social: Yup.string(),
  direccion_fiscal: Yup.string(),
  comprobante_fiscal: Yup.string(),
});

export default function useFiscalInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const {data:user} = useSession();
  const dispatch = useUIAppDispatch();
  // selectors
  /**
   * constancia_pdf:"",
   * direccion_fiscal:"",
   * razon_social:"",
   * rfc:""
   */
  const {toastSuccess, toastError} = useToast()
  const rfcSelector = useUIAppSelector((state) => state.auth.profile.profileInfo.rfc);
  const razonSocialSelector = useUIAppSelector((state) => state.auth.profile.profileInfo.razon_social);
  const direccionFiscalSelector = useUIAppSelector((state) => state.auth.profile.profileInfo.direccion_fiscal);

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
    if(rfcSelector || razonSocialSelector || direccionFiscalSelector){
      setValue("rfc",rfcSelector);
      setValue("razon_social",razonSocialSelector);
      setValue("direccion_fiscal",direccionFiscalSelector);
    }
  },[user?.user?.access_token]);

  const submit = async (data:any) => {
    if(!user?.user?.access_token) return;
    
    setIsLoading(true);
    try {
      const setFiscalInfoData = await setFiscalInfo({
        token: user?.user?.access_token,
        constancia_pdf: data.comprobante_fiscal,
        direccion_fiscal: data.direccion_fiscal,
        razon_social: data.razon_social,
        rfc: data.rfc
      });

      if(setFiscalInfoData.message ==='Información fiscal actualizada'){
        dispatch(setRFC(data.rfc));
        dispatch(setRazonSocial(data.razon_social));
        dispatch(setDireccionFiscal(data.direccion_fiscal));
         toastSuccess(setFiscalInfoData.message);
      }else{
        toastError("Error al actualizar información fiscal");
      }
      
    } catch (error) {
      toastError("Error al actualizar información fiscal");
      console.error("Error submitting form:", error);
    }finally{
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    register,
    handleSubmit,
    submit,
    errors,
    isValid,
  };
}
