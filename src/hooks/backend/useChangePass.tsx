"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const schema = Yup.object({
  oldPassword: Yup.string().required("Contraseña anterior es requerida"),
  newPassword: Yup.string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
    .matches(/\d/, "Debe contener al menos un número")
    .required("Nueva contraseña es requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Las contraseñas deben coincidir")
    .required("Confirmar contraseña es requerido"),
});

export default function useChangePass() {
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

  const onSubmit = () => {
    console.log("object");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    reset({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  console.log(errors, "errors");

  return {
    onSubmit,
    errors,
    handleSubmit,
    register,
    isValid,
    isLoading,
  };
}
