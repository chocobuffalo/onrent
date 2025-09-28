"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import createMachinery from "@/services/createMachinery.adapter";
import { CreateMachineryRequest, MachineFormData } from "@/types/machinary";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const schema = Yup.object().shape({
  name: Yup.string().required("Nombre de la maquinaria es requerida"),
  brand: Yup.string(),
  model: Yup.string(),
  serial_number: Yup.string().required("Número de serie es requerido"),
  machine_type: Yup.string().required("Tipo de maquinaria es requerido"),
  daily_rate: Yup.number()
    .typeError("Debe ser un número")
    .required("Tarifa diaria es requerida")
    .min(0, "La tarifa diaria no puede ser negativa"),
  status: Yup.string().required("Estado de la maquinaria es requerido"),
  location_info: Yup.string().required("Información de ubicación es requerida"),
  weight_tn: Yup.number()
    .typeError("Debe ser un número")
    .min(0, "El peso no puede ser negativo")
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),
  motor_spec: Yup.string(),
  height_m: Yup.number()
    .typeError("Debe ser un número")
    .min(0, "La altura no puede ser negativa")
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),
  width_m: Yup.number()
    .typeError("Debe ser un número")
    .min(0, "El ancho no puede ser negativo")
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),
  seat_count: Yup.number()
    .typeError("Debe ser un número")
    .min(0, "El número de asientos no puede ser negativo")
    .integer("El número de asientos debe ser un número entero")
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    }),
  fuel_type: Yup.string().required("Tipo de combustible es requerido"),
  machine_category: Yup.string().required(
    "Categoría de maquinaria es requerida"
  ),
  // image: Yup.mixed<FileList>(), // TODO: Uncomment when image upload is implemented
  gps_lat: Yup.number(),
  gps_lng: Yup.number(),
});

export default function useMachineForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<MachineFormData>({
    resolver: yupResolver(schema) as any,
    mode: "onBlur",
    defaultValues: {
      name: "",
      brand: "",
      model: "",
      serial_number: "",
      machine_type: "",
      daily_rate: undefined,
      status: "",
      location_info: "",
      weight_tn: undefined,
      motor_spec: "",
      height_m: undefined,
      width_m: undefined,
      seat_count: undefined,
      fuel_type: "",
      machine_category: "",
      gps_lat: undefined,
      gps_lng: undefined,
      // image: undefined, // TODO: Uncomment when image upload is implemented
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const submit = async (data: MachineFormData) => {
    setIsLoading(true);
    
    try {
      const machineryData: CreateMachineryRequest = {
        name: data.name.trim(),
        brand: data.brand?.trim() || "",
        model: data.model?.trim() || "",
        serial_number: data.serial_number.trim(),
        machine_type: data.machine_type,
        daily_rate: Number(data.daily_rate),
        status: data.status,
        location_info: data.location_info.trim(),
        machine_category: data.machine_category,
        fuel_type: data.fuel_type,
        weight_tn: data.weight_tn ? Number(data.weight_tn) : 0,
        motor_spec: data.motor_spec?.trim() || "",
        height_m: data.height_m ? Number(data.height_m) : 0,
        width_m: data.width_m ? Number(data.width_m) : 0,
        seat_count: data.seat_count ? Number(data.seat_count) : 0,
        gps_lat: data.gps_lat ? Number(data.gps_lat) : undefined,
        gps_lng: data.gps_lng ? Number(data.gps_lng) : undefined,
        geospatial_status: data.gps_lat && data.gps_lng ? "available" : undefined,
      };

      const result = await createMachinery(machineryData, (session.data as (typeof session.data & { accessToken?: string }))?.accessToken || "");
      
      if (result.success) {
        toast.success(`Maquinaria "${data.name}" registrada exitosamente`);
        reset();
      } else {
        toast.error(result.message || "Error al crear la maquinaria");
        throw new Error(result.message || "Error al crear la maquinaria");
      }
    } catch (error: any) {
      toast.error("Error al crear la maquinaria. Inténtalo de nuevo.");
      throw error;
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
    watch,
    setValue,
  };
}