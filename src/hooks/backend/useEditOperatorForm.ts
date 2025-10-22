"use client";

import { useState, useEffect } from "react";
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

const safeString = (value: string | null | boolean | undefined): string => {
  if (value === false || value === null || value === undefined) {
    return "";
  }
  return String(value);
};

export default function useEditOperatorForm(editData: OperatorResponse) {
  const getRegionId = (): string => {
    if (editData.region && typeof editData.region === 'object' && 'id' in editData.region) {
      console.log("✅ Region encontrado como objeto con id:", editData.region.id);
      return String(editData.region.id);
    }
    if (editData.region_id) {
      console.log("✅ Region_id encontrado directamente:", editData.region_id);
      return String(editData.region_id);
    }
    if (typeof editData.region === 'number') {
      console.log("✅ Region encontrado como número:", editData.region);
      return String(editData.region);
    }
    console.log("❌ No se encontró región");
    return "";
  };

  const calculatedRegionId = getRegionId();
  console.log("🔍 [useEditOperatorForm] Región calculada final:", calculatedRegionId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<OperatorFormData>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      curp: "",
      license_number: "",
      license_type: "",
      region_id: "", // ⚠️ Dejar vacío inicialmente
      address: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  // ✅ SOLUCIÓN: Usar useEffect para setear TODOS los valores después del render
  useEffect(() => {
    console.log("🔄 [useEffect] Seteando valores en el formulario...");
    
    setValue("name", editData.name || "", { shouldValidate: true });
    setValue("email", editData.email || "", { shouldValidate: true });
    setValue("phone", editData.phone || "", { shouldValidate: true });
    setValue("curp", safeString(editData.curp), { shouldValidate: true });
    setValue("license_number", safeString(editData.license_number), { shouldValidate: true });
    setValue("license_type", safeString(editData.license_type), { shouldValidate: true });
    setValue("address", safeString(editData.address), { shouldValidate: true });
    
    // ✅ IMPORTANTE: Setear region_id DESPUÉS con setValue
    if (calculatedRegionId) {
      console.log("✅ [useEffect] Seteando region_id:", calculatedRegionId);
      setValue("region_id", calculatedRegionId, { shouldValidate: true });
    }
  }, [editData, calculatedRegionId, setValue]);

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

      console.log("📤 Payload que se enviará al backend:", updatePayload);

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
      console.error("❌ Error en submit:", error);
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
