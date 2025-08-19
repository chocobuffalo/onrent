'use client'

import DateInput from "@/components/atoms/dateinput/dateinput";
import FilterInput from "@/components/atoms/filterInput/filterInput";
import Input from "@/components/atoms/Input/Input";
import useNewProjectForm from "@/hooks/frontend/buyProcess/useNewProjectForm";

export default function NewProjectForm() {

    const { register,
           handleSubmit,
           errors,
           isValid } = useNewProjectForm()

    return  (
      <form  className="">
        <h2 className="text-xl  mb-4">
         1. Datos Básicos
        </h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
          <div className="w-full lg:w-1/2">
            <Input
              label="Nombre del responsable"
              name="responsible_name"
              type="text"
              placeHolder="Ingresa el nombre del responsable"
              register={register}
              errors={errors}
              labelClass=""
              containerClass="flex flex-col gap-2"
              inputClass="w-full rounded-sm px-4 py-2 border-[#bbb] border-1 focus:outline-none"

            />

          </div>
          <div className="w-full lg:w-1/2">
          <Input
              label="Nombre del proyecto"
              name="name"
              type="text"
              placeHolder="Ingresa el nombre del proyecto"
              register={register}
              errors={errors}
              labelClass=""
              containerClass="flex flex-col gap-2"
              inputClass="w-full rounded-sm px-4 py-2 border-[#bbb] border-1 focus:outline-none"

            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
          <div className="w-full lg:w-1/2"><DateInput action={(text)=>console.log(text)} value=""  startDate={{ month:10, day:10, year:2025 }}   placeholder="Fecha de inicio de la obra"  /></div>
          <div className="w-full lg:w-1/2"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
          <div className="w-full lg:w-1/2">
          <div className="flex flex-col gap-2">
            <label className="" htmlFor="name">Ubicación de la obra </label>
            <FilterInput
              checkpersist={true}
              inputClass="w-full rounded-sm p-0 px-2 border-[#bbb] border-1 focus:outline-none"
            />
          </div>
          </div>
          <div className="w-full lg:w-1/2">

          <Input
              label="Duración estimada"
              name="estimated_duration"
              type="number"
              placeHolder="20 semanas"
              register={register}
              errors={errors}
              labelClass=""
              containerClass="flex flex-col gap-2"
              inputClass="w-full rounded-sm px-4 py-2 border-[#bbb] border-1 focus:outline-none"

            />
          </div>
        </div>
      </form>
    ) ;
}
