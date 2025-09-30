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
  const [pdfFile, setPdfFile] = useState<string | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      console.log("❌ No se seleccionó archivo");
      return;
    }

    console.log("📄 Archivo seleccionado:", file);

    if (file.type !== "application/pdf") {
      toastError("Solo se permiten archivos PDF");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      console.log("✅ PDF convertido a base64 (primeros 100 chars):", base64.substring(0, 100));
      
      setPdfFile(base64);
      setValue("comprobante_fiscal", base64);
    };
    reader.onerror = () => {
      console.error("❌ Error al leer archivo");
      toastError("Error al procesar el archivo PDF");
    };
    reader.readAsDataURL(file);
  };

  const submit = async (data:any) => {
    if(!user?.user?.access_token) return;
    
    console.log("📤 Datos del formulario:", data);
    console.log("📎 PDF adjunto:", data.comprobante_fiscal ? "SÍ (primeros 50 chars): " + data.comprobante_fiscal.substring(0, 50) : "❌ NO");
    
    setIsLoading(true);
    try {
      const payload = {
        token: user?.user?.access_token,
        constancia_pdf: data.comprobante_fiscal,
        direccion_fiscal: data.direccion_fiscal,
        razon_social: data.razon_social,
        rfc: data.rfc
      };
      
      console.log("🚀 Payload completo a enviar:", payload);
      
      const setFiscalInfoData = await setFiscalInfo(payload);

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
    handleFileChange,
    pdfFile
  };
}