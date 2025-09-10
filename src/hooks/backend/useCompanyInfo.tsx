"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { setCompanyInfoData } from "@/services/setCompanyInfo";
import { useToast } from "../frontend/ui/useToast";
import { setContactoFiscal, setDireccionEmpresa, setEmpleados, setEmpresa, setRepresentanteLegal, setRfcEmpresa, setTelefonoContacto } from "@/libs/redux/features/auth/authSlicer";


const schema = Yup.object({
  empresa: Yup.string(),
  rfc_empresa: Yup.string(),
  direccion_empresa: Yup.string(),
  contacto_fiscal: Yup.string(),
  telefono_contacto: Yup.string(),
  representante_legal: Yup.string(),
  empleados: Yup.number()
    .min(1, "Debe ser al menos 1"),
});

export default function useCompanyInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const {data:session} = useSession()
  const dispatch = useUIAppDispatch();
  const companyInfo = useUIAppSelector((state) => state.auth.profile.companyInfo);
  const {toastSuccess,toastError } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  // actualizamos los datos desde el 
  useEffect(() => {
    setValue("empresa", companyInfo.empresa || "");
    setValue("rfc_empresa", companyInfo.rfc_empresa || "");
    setValue("direccion_empresa", companyInfo.direccion_empresa || "");
    setValue("contacto_fiscal", companyInfo.contacto_fiscal || "");
    setValue("telefono_contacto", companyInfo.telefono_contacto || "");
    setValue("representante_legal", companyInfo.representante_legal || "");
    setValue("empleados", companyInfo.empleados || 0);
  }, [session])


  const onSubmit = async (data:any) => {
    setIsLoading(true);
    try {
      // Simulate an API call
      const getInfo = await setCompanyInfoData({
        token: session?.user?.access_token || "",
        empresa: data.empresa || "",
        rfc_empresa: data.rfc_empresa || "",
        direccion_empresa: data.direccion_empresa || "",
        contacto_fiscal: data.contacto_fiscal || "",
        telefono_contacto: data.telefono_contacto || "",
        representante_legal: data.representante_legal || "",
        empleados: data.empleados || 1,
      })
      if(getInfo){
        toastSuccess("Información de la empresa actualizada correctamente");
        // Actualizamos el estado global
        dispatch(setEmpresa(data.empresa || ""));
        dispatch(setRfcEmpresa(data.rfc_empresa || ""));
        dispatch(setDireccionEmpresa(data.direccion_empresa || ""));
        dispatch(setContactoFiscal(data.contacto_fiscal || ""));
        dispatch(setTelefonoContacto(data.telefono_contacto || ""));
        dispatch(setRepresentanteLegal(data.representante_legal || ""));
        dispatch(setEmpleados(data.empleados || 1));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toastError("Error al actualizar la información de la empresa");
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

    isLoading,
  };
}
