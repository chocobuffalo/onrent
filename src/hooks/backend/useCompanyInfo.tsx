"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
// import { useUIAppSelector } from "@/libs/redux/hooks";

const schema = Yup.object({
  empresa: Yup.string().required("La razón social es requerida"),
  rfc_empresa: Yup.string().required("El RFC es requerido"),
  direccion_empresa: Yup.string().required("La dirección es requerida"),
  contacto_fiscal: Yup.string().required("El contacto fiscal es requerido"),
  telefono_contacto: Yup.string().required(
    "El teléfono de contacto es requerido"
  ),
  representante_legal: Yup.string().required(
    "El representante legal es requerido"
  ),
  empleados: Yup.number()
    .required("El número de empleados es requerido")
    .min(1, "Debe ser al menos 1"),
});

export default function useCompanyInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate an API call
    } catch (error) {
      console.error("Error submitting form:", error);
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
