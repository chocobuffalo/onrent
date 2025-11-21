"use client";
import React from "react";
import { MachineryResponse } from "@/types/machinary";
import { ImSpinner8 } from "react-icons/im";
import { typeOptions } from "@/constants/routes/home";
import {
  fuel_type_options,
  machineSelector,
  statusOptions,
} from "@/constants/routes/machineForm";
import Input from "@/components/atoms/Input/Input";
import SelectInput from "@/components/atoms/selectInput/selectInput";
import FileInput from "@/components/atoms/FileInput/FileInput";
import EditFilterInput from "@/components/atoms/EditFilterInput/EditFilterInput";
import useEditMachineFormUI from "@/hooks/frontend/ui/useEditMachineFormUI";
import { useSession } from "next-auth/react";
// Reemplazamos el uploader único por las pestañas que muestran ambos flujos
import CertTabs from "@/components/organism/CertTabs/CertTabs";
import "./EditMachineForm.scss";

interface EditMachineFormProps {
  editData: MachineryResponse;
  onSuccess?: () => Promise<void>;
}

const EditMachineForm = ({ editData, onSuccess }: EditMachineFormProps) => {
  // Hooks deben estar dentro del componente
  const { data: session } = useSession();
  const token = (session as any)?.accessToken || (session as any)?.access_token || "";

  const {
    register,
    handleSubmit,
    submit,
    errors,
    isLoading,
    isValid,
    handleFileChange,
    handleLocationChange,
  } = useEditMachineFormUI({ editData, onSuccess });

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
              <EditFilterInput
                key={`location-${editData?.id || "new"}`}
                initialValue={editData?.location_info || ""}
                onChange={handleLocationChange}
                error={errors.location_info?.message as string}
                name="location_info"
                placeholder="Indica tu ubicación"
              />
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
              placeHolder="Especificaciones del motor"
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
        </div>

        <div className="p-4">
          {/* Aquí integramos las pestañas que contienen ambos flujos */}
          <CertTabs
            machineId={editData.id}
            token={token}
            onCreated={(r) => {
              // opcional: puedes reaccionar aquí (toast, set hidden field, etc.)
              console.log("Cert created", r);
            }}
          />
        </div>
      </div>

      <div className="group-button-submit modal-footer left mb-0">
        <button
          className="pre-btn submit-edit-button"
          type="submit"
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <ImSpinner8 color="#ffffff" size={20} className="animate-spin mx-auto" />
          ) : (
            <span>Actualizar maquinaria</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditMachineForm;
