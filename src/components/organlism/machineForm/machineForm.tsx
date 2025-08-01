"use client";
import FileInput from "@/components/atoms/FileInput/FileInput";
import Input from "@/components/atoms/Input/Input";
import SelectInput from "@/components/atoms/selectInput/selectInput";
import { typeOptions } from "@/constants/routes/home";
import {
  fuel_type_options,
  machineSelector,
  statusOptions,
} from "@/constants/routes/machineForm";
import useMachineForm from "@/hooks/backend/useMachineForm";
import { ImSpinner8 } from "react-icons/im";

export default function MachineForm() {
  const {
    register,
    handleSubmit,
    submit,
    errors,
    // isModalOpen,
    isLoading,
    isValid,
    // watch,
  } = useMachineForm();

  //   const machineTypeValue = watch ? watch("machine_type") : "";
  return (
    <form className="container" onSubmit={handleSubmit(submit)}>
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
              label="Typo de maquinaria"
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
            <Input
              label="Información de ubicación"
              type="text"
              name="location_info"
              placeHolder="Información de ubicación"
              register={register}
              errors={errors}
            />
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
              placeHolder=""
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 col-lg-4">
            <Input
              label="Peso de la maquinaria"
              type="text"
              name="weight_tn"
              placeHolder=""
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 col-lg-4">
            <Input
              label="Altura de la maquinaria"
              type="text"
              name="height_m"
              placeHolder=""
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-md-6 col-lg-4">
            <Input
              label="Longitud de la maquinaria"
              type="text"
              name="width_m"
              placeHolder=""
              register={register}
              errors={errors}
            />
          </div>

          <div className="col-md-6 col-lg-4">
            <Input
              label="Numero de asientos"
              type="text"
              name="seat_count"
              placeHolder=""
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
      <div className="group-button-submit modal-footer left mb-0">
        <button
          className="pre-btn"
          type="submit"
          disabled={!isValid && !isLoading}
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
}
