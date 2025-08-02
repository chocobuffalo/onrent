/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { useForm } from "react-hook-form";
import { closeModal } from "@/libs/redux/features/ui/modalSlicer";

const schema = Yup.object({
  name: Yup.string().required("Nombre de la maquinaria es requerida"),
  brand: Yup.string(),
  model: Yup.string(),
  serial_number: Yup.string().required("Número de serie es requerido"),
  machine_type: Yup.string().required("Tipo de maquinaria es requerido"),
  daily_rate: Yup.number()
    .typeError("Debe ser un número")
    .required("Tarifa diaria es requerida")
    .positive("La tarifa diaria debe ser un número positivo"),
  status: Yup.string().required("Estado de la maquinaria es requerido"),
  location_info: Yup.string().required("Información de ubicación es requerida"),
  weight_tn: Yup.number()
    .typeError("Debe ser un número")
    .positive("El peso debe ser un número positivo")
    .required("Peso en toneladas es requerido"),
  motor_spec: Yup.string(),
  height_m: Yup.number()
    .typeError("Debe ser un número")
    .required("Altura en metros es requerida")
    .positive("La altura debe ser un número positivo"),
  width_m: Yup.number()
    .typeError("Debe ser un número")
    .required("Ancho en metros es requerido")
    .positive("El ancho debe ser un número positivo"),
  seat_count: Yup.number()
    .typeError("Debe ser un número")
    .required("Número de asientos es requerido")
    .positive("El número de asientos debe ser un número positivo"),
  fuel_type: Yup.string().required("Tipo de combustible es requerido"),
  machine_category: Yup.string().required(
    "Categoría de maquinaria es requerida"
  ),
  image: Yup.mixed(),
});
export default function useMachineForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const isModalOpen = useUIAppSelector((state) => state.modal.isOpen);
  const dispatch = useUIAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const submit = (data: any) => {
    setIsLoading(true);
    dispatch(closeModal());
  };
  return {
    register,
    handleSubmit,
    errors,
    submit,
    watch,
    isModalOpen,
    isLoading,
    isValid,
  };
}
