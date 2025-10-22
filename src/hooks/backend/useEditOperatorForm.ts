"use client";

import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import updateOperator from "@/services/updateOperator.adapter";
import {
  UpdateOperatorRequest,
  OperatorResponse,
  UpdateOperatorResponse,
} from "@/types/operator";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

// 🔹 Esquema de validación con Yup
const schema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  email: Yup.string().email("Correo inválido").required("El correo es requerido"),
  phone: Yup.string().required("El teléfono es requerido"),
  curp: Yup.string().required("La CURP es requerida"),
  license_number: Yup.string().required("La licencia es requerida"),
  license_type: Yup.string().required("El tipo de licencia es requerido"),
  region_id: Yup.string().required("La región es requerida"),
  address: Yup.string().required("La dirección es requerida"),
});

interface OperatorFormData {
  name: string;
  email: string;
  phone: string;
  curp: string;
  license_number: string;
  license_type: string;
  region_id: string;
  address: string;
  gps_lat?: number | null;
  gps_lng?: number | null;
}

export default function useEditOperatorForm(editData: OperatorResponse) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<OperatorFormData>({
    resolver: yupResolver(schema) as any,
    mode: "onBlur",
    defaultValues: {
      name: editData.name || "",
      email: editData.email || "",
      phone: editData.phone || "",
      curp: "", // Si tienes CURP en editData, agrégalo
      license_number: "", // Si tienes license en editData, agrégalo
      license_type: "",
      region_id: "", // Si tienes region_id en editData, agrégalo
      address: "", // Si tienes address en editData, agrégalo
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const submit = async (data: OperatorFormData) => {
    console.log(">>> SUBMIT EDITAR ejecutado con datos:", data);
    setIsLoading(true);
    
    try {
      const token = (session.data as (typeof session.data & { accessToken?: string }))?.accessToken || "";

      const updatePayload: UpdateOperatorRequest = {
        id: editData.operator_id,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        curp: data.curp.trim(),
        license_number: data.license_number.trim(),
        license_type: data.license_type,
        region_id: data.region_id,
        address: data.address.trim(),
        gps_lat: data.gps_lat ?? null,
        gps_lng: data.gps_lng ?? null,
      };

      const result: UpdateOperatorResponse = await updateOperator(
        token,
        editData.operator_id,
        updatePayload
      );

      if (result.success) {
        toast.success(`Operador "${data.name}" actualizado exitosamente`);
        return true;
      } else {
        toast.error(result.message || "Error al actualizar el operador");
        return false;
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Error al actualizar el operador. Inténtalo de nuevo.");
      return false;
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
    setValue,
    watch,
  };
}
