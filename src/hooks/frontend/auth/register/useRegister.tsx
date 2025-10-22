/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import createUser from "@/services/createUser";
import { useToast } from "../../ui/useToast";

import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react";

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
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { toastSuccessAction, toastError } = useToast();
  const router = useRouter();

  // 👇 Nuevo: capturar referral_code de la URL o de localStorage
  const [referralCode, setReferralCode] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      localStorage.setItem("referral_code", code);
      setReferralCode(code);
    } else {
      const stored = localStorage.getItem("referral_code");
      if (stored) setReferralCode(stored);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setRegistrationError(null);
    setRegistrationSuccess(false);

    console.log("Datos a enviar:", data);

    try {
      const createUserResponse = await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.tipoUsuario,
        referral_code: referralCode, // 👈 se envía si existe
      });

      console.log("Respuesta completa:", createUserResponse);

      if (createUserResponse.errors && createUserResponse.errors.length > 0) {
        setRegistrationError(createUserResponse.errors.join(", "));
        return;
      }

      if (createUserResponse.responseStatus >= 200 && createUserResponse.responseStatus < 300) {
        setRegistrationSuccess(true);

        toastSuccessAction(
          "Usuario registrado exitosamente, redirigiendo a tu perfil... Espere",
          () => {
            signIn("credentials", {
              email: data.email,
              password: data.password,
              redirect: true,
              callbackUrl: `/catalogo`,
            });
          }
        );
      } else {
        setRegistrationError("Error al registrar usuario. Por favor intenta nuevamente.");
        toastError("Error al registrar usuario. Por favor intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error inesperado al registrar el usuario:", error);
      toastError("Error inesperado. Por favor intenta nuevamente: " + error);
      setRegistrationError("Error inesperado. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    errors,
    isValid,
    register,
    isLoading,
    handleSubmit,
    onSubmit,
    registrationError,
    registrationSuccess,
  };
}

function toastSuccess(arg0: string) {
  throw new Error("Function not implemented.");
}
