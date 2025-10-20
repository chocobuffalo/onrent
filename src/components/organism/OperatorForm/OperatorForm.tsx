"use client";

import Input from "@/components/atoms/Input/Input";
import SelectInput from "@/components/atoms/selectInput/selectInput";
import FilterInput from "@/components/atoms/filterInput/filterInput";
import { ImSpinner8 } from "react-icons/im";
import useOperatorForm from "@/hooks/backend/useOperatorForm";
import { useEffect, useState } from "react";
import { SelectInterface } from "@/types/iu";
import { getRegionsList } from "@/services/getRegions";
import { useSession } from "next-auth/react";

interface OperatorFormProps {
  onCreated?: () => void;
}

export default function OperatorForm({ onCreated }: OperatorFormProps) {
  const { register, handleSubmit, submit, errors, isLoading, isValid } =
    useOperatorForm({ onCreated });

  const [regions, setRegions] = useState<SelectInterface[]>([]);
  const { data: session } = useSession();

  // 🔹 Cargar regiones desde el backend usando el adapter
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
            <Input label="Nombre" type="text" name="name" placeHolder="Nombre del operador" register={register} errors={errors}/>
          </div>
          <div className="col-md-6 pb-3">
            <Input label="Correo" type="email" name="email" placeHolder="Correo electrónico" register={register} errors={errors}/>
          </div>
          <div className="col-md-6 pb-3">
            <Input label="Contraseña" type="password" name="password" placeHolder="Contraseña" register={register} errors={errors}/>
          </div>
          <div className="col-md-6 pb-3">
            <Input label="Teléfono" type="text" name="phone" placeHolder="Teléfono" register={register} errors={errors}/>
          </div>
          <div className="col-md-6 pb-3">
            <Input label="CURP" type="text" name="curp" placeHolder="CURP" register={register} errors={errors}/>
          </div>
          <div className="col-md-6 pb-3">
            <Input label="Licencia" type="text" name="license" placeHolder="Número de licencia" register={register} errors={errors}/>
          </div>
          <div className="col-md-6 pb-3">
            <SelectInput
              options={regions}
              label="Región"
              name="region_id"
              placeHolder="Selecciona una región"
              register={register}
              errors={errors}
            />
          </div>

          {/* Dirección con autocompletado */}
          <div className="col-md-12 pb-3">
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <FilterInput checkpersist={false} name="address" />
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
            <span>Añadir operador</span>
          )}
        </button>
      </div>
    </form>
  );
}
