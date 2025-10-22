"use client";

import Input from "@/components/atoms/Input/Input";
import SelectInput from "@/components/atoms/selectInput/selectInput";
import EditFilterInput from "@/components/atoms/EditFilterInput/EditFilterInput";
import { ImSpinner8 } from "react-icons/im";
import useEditOperatorFormUI from "@/hooks/frontend/ui/useEditOperatorFormUI";
import { useEffect, useState } from "react";
import { SelectInterface } from "@/types/iu";
import { getRegionsList } from "@/services/getRegions";
import { useSession } from "next-auth/react";
import { OperatorResponse } from "@/types/operator";

interface EditOperatorFormProps {
  editData: OperatorResponse;
  onSuccess?: () => Promise<void>;
}

// ✅ Helper para convertir valores a string
const safeString = (value: string | null | boolean | undefined): string => {
  if (value === false || value === null || value === undefined) return "";
  return String(value);
};

export default function EditOperatorForm({ editData, onSuccess }: EditOperatorFormProps) {
  const { 
    register, 
    handleSubmit, 
    submit, 
    errors, 
    isLoading, 
    isValid, 
    setValue,
    handleLocationChange,
    watch,
  } = useEditOperatorFormUI({ editData, onSuccess });

  const [regions, setRegions] = useState<SelectInterface[]>([]);
  const { data: session } = useSession();

  // 🔹 Cargar regiones desde el backend
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const token = (session as any)?.accessToken;
        if (!token) {
          console.error("Token no encontrado");
          return;
        }

        const result = await getRegionsList(token);
        if (result.success && result.data) {
          setRegions(
            result.data.map((r) => ({
              value: String(r.id),
              label: r.name,
              color: "#000000",
            }))
          );
        } else {
          console.error(result.message);
        }
      } catch (err) {
        console.error("Error cargando regiones:", err);
      }
    };

    fetchRegions();
  }, [session]);

  return (
    <form className="container" onSubmit={handleSubmit(submit)} noValidate>
      <div className="modal-body">
        <div className="row p-4">
          {/* Campos básicos */}
          <div className="col-md-6 pb-3">
            <Input 
              label="Nombre" 
              type="text" 
              name="name" 
              placeHolder="Nombre del operador" 
              register={register} 
              errors={errors}
            />
          </div>
          <div className="col-md-6 pb-3">
            <Input 
              label="Correo" 
              type="email" 
              name="email" 
              placeHolder="Correo electrónico" 
              register={register} 
              errors={errors}
            />
          </div>
          <div className="col-md-6 pb-3">
            <Input 
              label="Teléfono" 
              type="text" 
              name="phone" 
              placeHolder="Teléfono" 
              register={register} 
              errors={errors}
            />
          </div>
          <div className="col-md-6 pb-3">
            <Input 
              label="CURP" 
              type="text" 
              name="curp" 
              placeHolder="CURP" 
              register={register} 
              errors={errors}
            />
          </div>

          {/* Número de licencia */}
          <div className="col-md-6 pb-3">
            <Input 
              label="Número de licencia" 
              type="text" 
              name="license_number" 
              placeHolder="Número de licencia" 
              register={register} 
              errors={errors}
            />
          </div>

          {/* Tipo de licencia */}
          <div className="col-md-6 pb-3">
            <SelectInput
              options={[
                { value: "A", label: "Tipo A", color: "#000000" },
                { value: "B", label: "Tipo B", color: "#000000" },
                { value: "C", label: "Tipo C", color: "#000000" },
              ]}
              label="Tipo de licencia"
              name="license_type"
              placeHolder="Selecciona tipo de licencia"
              register={register}
              errors={errors}
            />
          </div>

          {/* Región */}
          <div className="col-md-6 pb-3">
            <SelectInput
              key={`region-${watch("region_id") || "empty"}`}
              options={regions}
              label="Región"
              name="region_id"
              placeHolder="Selecciona una región"
              register={register}
              errors={errors}
              defaultValue={
                watch("region_id") && regions.length > 0
                  ? regions.find(r => r.value === watch("region_id"))
                  : undefined
              }
            />
          </div>

          {/* Dirección con autocompletado */}
          <div className="col-md-12 pb-3">
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <EditFilterInput 
                key={`location-${editData?.operator_id || 'new'}`}
                initialValue={safeString(editData?.address)}
                onChange={handleLocationChange}
                error={errors.address?.message as string}
                name="address"
                placeholder="Indica tu dirección"
              />
              {errors.address && (
                <div className="invalid-feedback d-block">
                  {errors.address?.message as string}
                </div>
              )}
            </div>
            
            {/* Campos ocultos para GPS */}
            <input type="hidden" {...register("gps_lat")} />
            <input type="hidden" {...register("gps_lng")} />
          </div>
        </div>
      </div>

      <div className="group-button-submit modal-footer left">
        <button className="pre-btn" type="submit" disabled={!isValid || isLoading}>
          {isLoading ? (
            <ImSpinner8 color="#ffffff" size={20} className="animate-spin mx-auto"/>
          ) : (
            <span>Actualizar operador</span>
          )}
        </button>
      </div>
    </form>
  );
}
