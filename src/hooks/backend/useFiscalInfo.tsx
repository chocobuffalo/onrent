/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
//mport { useUIAppDispatch } from "@/libs/redux/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const schema = Yup.object({
  rfc: Yup.string().required("RFC es requerido"),
  razon_social: Yup.string().required("Razón social es requerida"),
  direccion_fiscal: Yup.string().required("Dirección fiscal es requerida"),
  comprobante_fiscal: Yup.string().required("Comprobante fiscal es requerido"),
});

export default function useFiscalInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const submit = async () => {
    setIsLoading(true);
    try {
      setIsLoading(false);
      reset();
    } catch (error) {
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
