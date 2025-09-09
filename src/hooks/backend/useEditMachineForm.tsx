import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { updateMachinery } from "@/services/updateMachinery.adapter";
import { MachineryResponse, MachineFormData } from "@/types/machinary";
import { toast } from "react-toastify";

const schema = Yup.object().shape({
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
    .positive("El número de asientos debe ser un número positivo")
    .integer("El número de asientos debe ser un número entero"),
  fuel_type: Yup.string().required("Tipo de combustible es requerido"),
  machine_category: Yup.string().required("Categoría de maquinaria es requerida"),
  gps_lat: Yup.number(),
  gps_lng: Yup.number(),
});

const useEditMachineForm = (editData: MachineryResponse) => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

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
      name: editData?.name || "",
      brand: editData?.brand || "",
      model: editData?.model || "",
      serial_number: editData?.serial_number || "",
      machine_type: editData?.machine_type || "",
      daily_rate: editData?.daily_rate || undefined,
      status: editData?.status || "disponible",
      location_info: editData?.location_info || "",
      weight_tn: editData?.weight_tn || undefined,
      motor_spec: editData?.motor_spec || "",
      height_m: editData?.height_m || undefined,
      width_m: editData?.width_m || undefined,
      seat_count: editData?.seat_count || undefined,
      fuel_type: editData?.fuel_type || "diesel",
      machine_category: editData?.machine_category || "heavy",
      gps_lat: editData?.gps_lat || undefined,
      gps_lng: editData?.gps_lng || undefined,
    }
  });

  // Sincronizar formulario cuando editData cambie
  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name || "",
        brand: editData.brand || "",
        model: editData.model || "",
        serial_number: editData.serial_number || "",
        machine_type: editData.machine_type || "",
        daily_rate: editData.daily_rate || 0,
        status: editData.status || "disponible",
        location_info: editData.location_info || "",
        weight_tn: editData.weight_tn || 0,
        motor_spec: editData.motor_spec || "",
        height_m: editData.height_m || 0,
        width_m: editData.width_m || 0,
        seat_count: editData.seat_count || 0,
        fuel_type: editData.fuel_type || "diesel",
        machine_category: editData.machine_category || "heavy",
        gps_lat: editData.gps_lat || undefined,
        gps_lng: editData.gps_lng || undefined,
      });
    }
  }, [editData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Hook backend limpio: Solo API, validaciones y estados de carga
  const submit = async (data: MachineFormData) => {
    setIsLoading(true);

    try {
      if (!editData?.id) {
        toast.error("Error: ID de maquinaria no encontrado");
        setIsLoading(false);
        return;
      }

      const machineryData = {
        ...data,
        daily_rate: Number(data.daily_rate),
        weight_tn: Number(data.weight_tn),
        height_m: Number(data.height_m),
        width_m: Number(data.width_m),
        seat_count: Number(data.seat_count),
        gps_lat: data.gps_lat ? Number(data.gps_lat) : undefined,
        gps_lng: data.gps_lng ? Number(data.gps_lng) : undefined,
        image: image || undefined,
      };

      const result = await updateMachinery(editData.id, machineryData);

      if (result.success) {
        toast.success("Maquinaria actualizada exitosamente");
        console.log("🎯 useEditMachineForm - Submit exitoso, hook UI manejará coordinación");
        
        // Solo retorna éxito, sin efectos secundarios de UI
        
      } else {
        toast.error(result.message || "Error al actualizar la maquinaria");
        throw new Error(result.message || "Error al actualizar la maquinaria");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error inesperado. Por favor, intenta nuevamente.");
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
    handleFileChange,
    image,
  };
};

export default useEditMachineForm;