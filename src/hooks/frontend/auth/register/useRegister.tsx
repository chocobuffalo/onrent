/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
//import { signIn } from "next-auth/react";
//import { redirect, RedirectType } from 'next/navigation'
import createUser from "@/services/createUser";


const schema = Yup.object({
  name: Yup.string().required("Este campo es obligatorio"),
  tipoUsuario: Yup.string().required("Selecciona un tipo de usuario"),
  email: Yup.string()
    .email("Formato de email inválido")
    .required("Este campo es obligatorio"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});
export default function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {

    
    //alert("Registro simulado");
    setIsLoading(true);
    console.log(data);
    try {
      const createUserResponse = await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.tipoUsuario,
      })
      console.log(createUserResponse , "createUser response");
      
      // const response = await signIn("credentials",{
      //   name: data.name,
      //   email: data.email,
      //   password: data.password,
      //   role: data.tipoUsuario,
      //   redirect: false,
      // })
      // if (!response.error) {
      //   // Manejar el exito aquí
      //  redirect('/dashboard/profile', RedirectType.push)

      // }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      // Aquí podrías manejar errores específicos de registro
    }
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
