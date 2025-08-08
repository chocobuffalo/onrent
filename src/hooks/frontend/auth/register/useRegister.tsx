/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useState } from "react";
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
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
      });

      console.log("Respuesta completa:", createUserResponse);

      // Verificar si hay errores en la respuesta
      if (createUserResponse.errors && createUserResponse.errors.length > 0) {
        setRegistrationError(createUserResponse.errors.join(", "));
        return;
      }

      // Verificar si la respuesta fue exitosa
      if (createUserResponse.responseStatus >= 200 && createUserResponse.responseStatus < 300) {
        console.log("Usuario registrado exitosamente:", createUserResponse.response);
        setRegistrationSuccess(true);
        
        // Aquí puedes agregar lógica adicional como:
        // - Redireccionar al usuario
        // - Mostrar mensaje de éxito
        // - Limpiar el formulario
        
      } else {
        setRegistrationError("Error al registrar usuario. Por favor intenta nuevamente.");
      }

    } catch (error) {
      console.error("Error inesperado al registrar el usuario:", error);
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