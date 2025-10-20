"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import createOperator from "@/services/createOperator.adapter";
import {
  CreateOperatorRequest,
  OperatorFormData,
  CreateOperatorResponse,
} from "@/types/operator";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { LocationClient, SearchPlaceIndexForTextCommand } from "@aws-sdk/client-location";

// 🔹 Esquema de validación con Yup
const schema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  email: Yup.string().email("Correo inválido").required("El correo es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
  phone: Yup.string().required("El teléfono es requerido"),
  curp: Yup.string().required("La CURP es requerida"),
  license: Yup.string().required("La licencia es requerida"),
  region_id: Yup.string().required("La región es requerida"),
  address: Yup.string().required("La dirección es requerida"), // 👈 requerido
});

export default function useOperatorForm({ onCreated }: { onCreated?: () => void } = {}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<OperatorFormData>({
    resolver: yupResolver(schema) as any,
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      curp: "",
      license: "",
      region_id: "",
      address: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const submit = async (data: OperatorFormData) => {
    console.log(">>> SUBMIT ejecutado con datos:", data);
    setIsLoading(true);
    try {
      // 🔹 Resolver dirección con AWS Location Service
      const client = new LocationClient({ region: "us-east-1" }); // ajusta región
      const command = new SearchPlaceIndexForTextCommand({
        IndexName: "tu-place-index", // 👈 usa el nombre de tu Place Index en AWS
        Text: data.address,
        MaxResults: 1,
      });

      const response = await client.send(command);
      const coords = response.Results?.[0]?.Place?.Geometry?.Point;

      const operatorData: CreateOperatorRequest = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        phone: data.phone.trim(),
        curp: data.curp.trim(),
        license: data.license.trim(),
        region_id: data.region_id,
        address: data.address.trim(),
        gps_lng: coords?.[0] ?? null,
        gps_lat: coords?.[1] ?? null,
      };

      const result: CreateOperatorResponse = await createOperator(
        operatorData,
        (session.data as (typeof session.data & { accessToken?: string }))?.accessToken || ""
      );

      if (result.success) {
        toast.success(`Operador "${data.name}" registrado exitosamente`);
        reset();
        if (onCreated) onCreated();
      } else {
        toast.error(result.message || "Error al crear el operador");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Error al crear el operador. Inténtalo de nuevo.");
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
  };
}
