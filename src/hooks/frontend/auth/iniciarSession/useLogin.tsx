/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const schema = Yup.object({
  emailOrPhone: Yup.string().required("Este campo es obligatorio"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),
});

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    console.log("Credenciales:", data);
    alert("Inicio de sesión simulado");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Aquí podrías llamar a una función para manejar el inicio de sesión real
      // Por ejemplo, usando signIn de next-auth
      // signIn('credentials', { ...data, redirect: false });
    }, 500);
  };

  return {
    errors,
    isValid,
    register,
    isLoading,
    handleSubmit,
    onSubmit,
  };
}
