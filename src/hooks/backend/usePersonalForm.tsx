/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useUIAppSelector } from "@/libs/redux/hooks";

const schema = Yup.object({
  fullName: Yup.string().required("Nombres y apellidos son requeridos"),
  telephone: Yup.string().required("Teléfono es requerido"),
});

export default function usePersonalForm() {
  const [isLoading, setIsLoading] = useState(false);
  const authEmail = useUIAppSelector((state) => state.auth.profile.email);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const onSubmit = async (data: any) => {
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
    // Example return values
    onSubmit,
    errors,
    handleSubmit,
    register,
    isValid,
    authEmail,
    isLoading,
  };
}
