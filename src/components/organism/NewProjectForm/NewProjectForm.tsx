'use client'

import DateInput from "@/components/atoms/dateinput/dateinput";
import FilterInput from "@/components/atoms/filterInput/filterInput";
import Input from "@/components/atoms/Input/Input";
import useNewProjectForm from "@/hooks/frontend/buyProcess/useNewProjectForm";
import { fixDate } from "@/utils/compareDate";

export default function NewProjectForm() {

    const { register,
           handleSubmit,handlerStartDate,
            handlerEndDate,
           project,
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
              inputClass="w-full h-[50px] rounded-sm px-4 py-2 border-[#bbb] border-1 focus:outline-none"

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
              inputClass="w-full rounded-sm px-4 h-[50px] py-2 border-[#bbb] border-1 focus:outline-none"

            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
          <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/2 flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label className="" htmlFor="name">Fecha de inicio de la obra </label>
                <DateInput 
                  action={handlerStartDate} 
                  value={project.start_date}
                  endDate={ typeof fixDate(project.end_date) === "object" ? fixDate(project.end_date) : undefined } 
                  placeholder="Fecha de inicio de la obra"  />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="flex flex-col gap-2">
                <label className="" htmlFor="name">Fecha de fin de la obra</label>
                <DateInput 
                  action={handlerEndDate} 
                  value={project.end_date}
                  startDate={ typeof fixDate(project.start_date) === "object" ? fixDate(project.start_date) : undefined } 
                  placeholder="Fecha de fin de la obra"  />
              </div>
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
                inputClass="w-full rounded-sm h-[50px] px-4 py-2 border-[#bbb] border-1 focus:outline-none"

              />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
            <div className="w-full ">
            <div className="flex flex-col gap-2">
              <label className="" htmlFor="name">Ubicación de la obra </label>
              <FilterInput
                checkpersist={true}
                inputClass="w-full rounded-sm p-0 px-2 h-[50px] border-[#bbb] border-1 focus:outline-none"
              />
            </div>
            </div>
         
        </div>
      </form>
    ) ;
}
