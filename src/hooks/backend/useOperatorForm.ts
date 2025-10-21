"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import createOperator from "@/services/createOperator.adapter";
import {
  CreateOperatorRequest,
  OperatorFormData,
  CreateOperatorResponse,
} from "@/types/operator";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const schema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  email: Yup.string().email("Correo inválido").required("El correo es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
  phone: Yup.string().required("El teléfono es requerido"),
  curp: Yup.string().required("La CURP es requerida"),
  license_number: Yup.string().required("La licencia es requerida"),
  license_type: Yup.string().required("El tipo de licencia es requerido"),
  region_id: Yup.string().required("La región es requerida"),
  address: Yup.string().required("La dirección es requerida"),
});

export default function useOperatorForm({ onCreated }: { onCreated?: () => void } = {}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<OperatorFormData>({
    resolver: yupResolver(schema) as any,
    mode: "onChange", // ✅ Cambiar de "onBlur" a "onChange"
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      curp: "",
      license_number: "",
      license_type: "",
      region_id: "",
      address: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const submit = async (data: OperatorFormData) => {
    console.log(">>> SUBMIT ejecutado con datos:", data);
    console.log(">>> Estado de sesión:", status);
    
    if (status === "loading") {
      toast.error("Cargando sesión, espera un momento...");
      return;
    }

    if (status === "unauthenticated") {
      toast.error("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    const token = (session as any)?.accessToken;
    
    if (!token) {
      console.error("❌ Token no encontrado");
      toast.error("No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.");
      return;
    }

    console.log("✅ Token encontrado:", token.substring(0, 20) + "...");

    setIsLoading(true);
    
    try {
      const operatorData: CreateOperatorRequest = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        phone: data.phone.trim(),
        curp: data.curp.trim(),
        license_number: data.license_number.trim(),
        license_type: data.license_type,
        region_id: data.region_id,
        address: data.address.trim(),
        gps_lng: null,
        gps_lat: null,
      };

      console.log(">>> Enviando datos al servicio:", operatorData);

      const result: CreateOperatorResponse = await createOperator(
        operatorData,
        token
      );

      console.log(">>> Resultado del servicio:", result);

      if (result.success) {
        toast.success(`Operador "${data.name}" registrado exitosamente`);
        reset();
        if (onCreated) onCreated();
      } else {
        toast.error(result.message || "Error al crear el operador");
        console.error("Error del backend:", result);
      }
    } catch (error: any) {
      console.error("❌ Error completo:", error);
      toast.error(error.message || "Error al crear el operador. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    submit,
    errors,
    isLoading,
    isValid,
    setValue,
  };
}
