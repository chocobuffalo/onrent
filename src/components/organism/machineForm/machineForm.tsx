"use client";
import FileInput from "@/components/atoms/FileInput/FileInput";
import Input from "@/components/atoms/Input/Input";
import SelectInput from "@/components/atoms/selectInput/selectInput";
import FilterInput from "@/components/atoms/filterInput/filterInput";
import { typeOptions } from "@/constants/routes/home";
import {
  fuel_type_options,
  machineSelector,
  statusOptions,
} from "@/constants/routes/machineForm";
import useMachineFormUI from "@/hooks/frontend/ui/useMachineFormUI";
import { ImSpinner8 } from "react-icons/im";

interface MachineFormProps {
  onCreated?: () => void;
}

const MachineForm = ({ onCreated }: MachineFormProps) => {

  const {
    register,
    handleSubmit,
    submit,
    errors,
    isLoading,
    isValid,
  } = useMachineFormUI({ onCreated });

  return (
    <form className="container" onSubmit={handleSubmit(submit)} noValidate>
      <div className="modal-body">
        <div className="row p-4">
          <div className="col-md-6 pb-3">
            <Input
              label="Nombre de la maquinaria"
              type="text"
              name="name"
              placeHolder="Nombre de la maquinaria"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 pb-3">
            <Input
              label="Marca"
              type="text"
              name="brand"
              placeHolder="Marca"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 pb-3">
            <Input
              label="Modelo"
              type="text"
              name="model"
              placeHolder="Modelo"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 pb-3">
            <Input
              label="Número de serie"
              type="text"
              name="serial_number"
              placeHolder="Número de serie"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 pb-3">
            <SelectInput
              options={machineSelector}
              label="Tipo de maquinaria"
              name="machine_type"
              placeHolder="Selecciona el tipo de maquinaria"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 pb-3">
            <Input
              label="Tarifa diaria"
              type="number"
              name="daily_rate"
              placeHolder="Tarifa diaria"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-12 pb-3">
            <div className="form-group">
              <label className="form-label">Información de ubicación</label>
              <FilterInput checkpersist={false} name="location_info" />
              {errors.location_info && (
                <div className="invalid-feedback d-block">
                  {errors.location_info?.message as string}
                </div>
              )}
            </div>
            
            {/* Campos ocultos para GPS */}
            <input type="hidden" {...register("gps_lat")} />
            <input type="hidden" {...register("gps_lng")} />
          </div>
          <div className="col-md-6 col-lg-4">
            <SelectInput
              options={statusOptions}
              label="Estado"
              name="status"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 col-lg-8">
            <Input
              label="Especificaciones del motor"
              type="text"
              name="motor_spec"
              placeHolder="0"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 col-lg-4">
            <Input
              label="Peso de la maquinaria (TN)"
              type="number"
              name="weight_tn"
              placeHolder="0"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 col-lg-4">
            <Input
              label="Altura de la maquinaria (M)"
              type="number"
              name="height_m"
              placeHolder="0"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 col-lg-4">
            <Input
              label="Longitud de la maquinaria (M)"
              type="number"
              name="width_m"
              placeHolder="0"
              register={register}
              errors={errors}
            />
          </div>

          <div className="col-md-6 col-lg-4">
            <Input
              label="Número de asientos"
              type="number"
              name="seat_count"
              placeHolder="0"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 col-lg-4">
            <SelectInput
              options={fuel_type_options}
              label="Tipo de combustible"
              name="fuel_type"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 col-lg-4">
            <SelectInput
              options={typeOptions}
              label="Categoría de la maquinaria"
              name="machine_category"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-12">
            <FileInput
              register={register}
              name="image"
              label="Imagen del equipo"
              placeHolder="Subir imagen"
            />
          </div>
        </div>
      </div>
      <div className="group-button-submit modal-footer left">
        <button
          className="pre-btn"
          type="submit"
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <ImSpinner8
              color="#ffffff"
              size={20}
              className="animate-spin mx-auto"
            />
          ) : (
            <span>Añadir maquinaria</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default MachineForm;