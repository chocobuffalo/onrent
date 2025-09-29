'use client'

import MountainIcon from "@/components/atoms/customIcons/mointain";
import DateInput from "@/components/atoms/dateinput/dateinput";
import Input from "@/components/atoms/Input/Input";
import SelectInput from "@/components/atoms/selectInput/selectInput";
import { terrainTypes } from "@/constants";
import { typeOptions } from "@/constants/routes/home";
import { projectStates } from "@/constants/states";
import useNewProjectForm from "@/hooks/frontend/buyProcess/useNewProjectForm";
import { countDays, fixDate } from "@/utils/compareDate";
import currentDate from "@/utils/currentDate";
import { FaCheck } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";

export default function NewProjectForm({
    projectID,
    projectAct,
    machineId, 
    machinetype     
}:{
    projectID?:string,
    projectAct?:()=>void,
    machineId?: string | null,  
    machinetype?: string | null 
}){

    const {
          register,
          sending,
          handleSubmit,
          setValue,
          handlerStartDate,
          handlerEndDate,
          convertFileToBase64,
          clearErrors,
          handlerWorkSchedule,
          reserves_types,
          project,
          errors,
          terrainType, 
          setTerrainType,
          onSubmit,
          setProject,
          isValid,
          searchQuery,
          setSearchQuery,
          searchResults,
          isSearching,
          showResults,
          setShowResults,
          selectSearchResult,
          selectedLocationData
      } = useNewProjectForm({
              projectId: projectID || "", 
              projectAct: projectAct || undefined,
              machineId,      
              machinetype   
          });

          const dayValue = project.estimated_duration !== "NaN" ? `${project.estimated_duration}  ${project.estimated_duration === "1" ? "día" : "días" }` : "calculando..." ;
          
          const handlerGetTerrainType = (type:string) => {
            if (terrainType.includes(type)) {
              setTerrainType(terrainType.filter(t => t !== type));
            } else {
              setTerrainType([...terrainType, type]);
            }
          }

    return  (
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="mb-10">
          <h2 className="text-xl  mb-4">1. Datos Básicos</h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
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
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
            <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-1/2 flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label className="" htmlFor="start_date">Fecha de inicio de la obra </label>
                  <DateInput 
                    action={(date:string)=>{handlerStartDate(date);handlerWorkSchedule(date, project.end_date)}} 
                    value={project.start_date}
                    endDate={ typeof fixDate(project.end_date) === "object" ? fixDate(project.end_date) : undefined } 
                    placeholder="Fecha de inicio de la obra"  />
                    <input type="hidden" {...register("start_date")} className="hidden" name="start_date" value={project.start_date} />
                    {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex flex-col gap-2">
                  <label className="" htmlFor="end_date">Fecha de fin de la obra</label>
                  <DateInput 
                    action={(date:string)=>{handlerEndDate(date);handlerWorkSchedule(project.start_date, date)}} 
                    value={project.end_date}
                    startDate={project.start_date !== '' && typeof fixDate(project.start_date) === "object" ? fixDate(project.start_date) : currentDate() }
                    placeholder="Fecha de fin de la obra"  />
                    <input type="hidden" {...register("end_date")} name="end_date" value={project.end_date} />
                    {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date.message}</p>}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="form-group flex flex-col gap-2">
                <label className="" htmlFor="estimated_duration">Duración estimada </label>
              {
                project.start_date &&   <input type="text" 
                  className="form-control mb-1 w-full rounded-sm h-[50px] px-4 py-2 border-none border-1 focus:outline-none" 
                  placeholder="20 semanas"
                  {...register("estimated_duration")} 
                  name="estimated_duration"
                  disabled={true}
                  value={dayValue}/>
              }
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
             <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-4">
              <Input
                label="Horario de trabajo"
                name="work_schedule"
                type="text"
                placeHolder="Ingresa el horario de trabajo"
                register={register}
                errors={errors}
                labelClass=""
                containerClass="flex w-full flex-col gap-2"
                inputClass="w-full rounded-sm px-4 h-[50px] py-2 border-[#bbb] border-1 focus:outline-none"
              />
             </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
              <div className="w-full lg:w-1/2">
                <div className="form-group flex flex-col gap-2">
                  <label className="" htmlFor="location">Ubicación del proyecto</label>
                  
                  <div className="relative">
                    <input
                      type="text"
                      className="form-control mb-1 w-full rounded-sm px-4 h-[50px] py-2 border-[#bbb] border-1 focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        clearErrors("location");
                      }}
                      onFocus={() => setShowResults(searchResults.length > 0)}
                      onBlur={() => setTimeout(() => setShowResults(false), 200)}
                      placeholder="Buscar dirección del proyecto"
                    />
                    
                    {showResults && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-60 overflow-y-auto shadow-lg mt-1">
                        {isSearching ? (
                          <li className="py-3.5 px-3 text-center">
                            <ImSpinner8 color="#ea6300" size={20} className="animate-spin mx-auto" />
                          </li>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((result, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                className="w-full py-3.5 px-3 text-left hover:bg-gray-100 transition-colors"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  selectSearchResult(result);
                                }}
                              >
                                {result.Place.Label}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="py-3.5 px-3 text-gray-500">
                            No hay resultados
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  
                  {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <Input
                  label="Teléfono del encargado de obra"
                  name="manager_phone"
                  type="text"
                  placeHolder=" +52 000 0000000 "
                  register={register}
                  errors={errors}
                  labelClass=""
                  containerClass="flex flex-col gap-2"
                  inputClass="w-full rounded-sm px-4 h-[50px] py-2 border-[#bbb] border-1 focus:outline-none"
                />
              </div>
          </div>
        </div>
        <div className="mb-10">
           <h2 className="text-xl  mb-4">2. Condiciones del sitio</h2>
           <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
              <div className="w-full lg:w-1/2">
                <Input
                  label="Tipo de trabajo"
                  name="work_type"
                  type="text"
                  placeHolder="Ingresa el tipo de trabajo"
                  register={register}
                  errors={errors}
                  labelClass=""
                  containerClass="flex flex-col gap-2"
                  inputClass="w-full h-[50px] rounded-sm px-4 py-2 border-[#bbb] border-1 focus:outline-none"
                />
              </div>
           </div>
           <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
              <div className="w-full lg:w-1/2">
                <div className="form-group flex flex-col gap-2">
                  <label className="" htmlFor="terrain_type">Condiciones del terreno</label>
                  <div className="flex flex-wrap gap-2">
                   {
                     terrainTypes.map(terrain=>{
                       const isSelected = terrainType.includes(terrain.value);
                       return(
                          <div
                            onClick={() => handlerGetTerrainType(terrain.value)} 
                            className={`border-1 cursor-pointer duration-300 hover:bg-secondary hover:text-white  border-secondary rounded-[30px] px-2 py-0.5 color ${isSelected ? "bg-secondary text-white" : "text-secondary"}`} key={terrain.value}>
                            {terrain.label}
                          </div>
                        )
                      })
                    }
                    <input type="hidden"  value={project.terrain_type} />
                    </div>
                </div>
              </div>
           </div>
           <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
             <div className="w-full lg:w-1/2">
                <div className="form-group flex flex-col gap-2">
                    <label className="" htmlFor="terrain_type">Seguridad en el sitio</label>
                    <div className="flex flex-wrap gap-2">
                      <fieldset className="flex items-center gap-2">
                      {
                        reserves_types.map(reserve_type=>{
                          return(<label className="gap-1.5 flex items-center"  key={reserve_type}>{reserve_type}<input checked={project.has_reserve_space === reserve_type} className="appearance-none checked:bg-secondary border-3 rounded-full cursor-pointer border-white   ring-1   ring-secondary h-[18px] w-[18px] " name="has_reserve_space" onClick={() => setProject(prev => ({ ...prev, has_reserve_space: reserve_type }))} type="radio" value={reserve_type} /> </label>)
                        })
                      }
                      </fieldset>
                    </div>
                </div>
              </div>
           </div>
          
            {
              project.has_reserve_space === "Si" && (
                 <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 duration-300">
              <div className="flex flex-col md:flex-row items-end gap-2">
                 <div className="flex flex-col gap-2">
                      <label htmlFor={'resguardo_files'} className={'form-label'}>Lugar del resguardo</label>
                      <input
                        className="d-none"
                        hidden
                        type="file"
                        id={'resguardo_files'}
                        onChange={(e) => {
                          convertFileToBase64(e.target.files?.[0] as File)
                        }}
                      />
                      <div className="flex  gap-3 items-center">
                        <div
                          className="d-flex gap-2 button-resguardo cursor-pointer flex items-center h-[50px]  w-fit max-w-[250px] rounded-sm px-4 py-2 border-[#bbb] border-1"
                          onClick={() => {
                            document.getElementById('resguardo_files')?.click();
                          }}
                        >
                          <MountainIcon/>
                          Selecione una imagen
                        </div>
                        {project.resguardo_files[0] && !errors.resguardo_files && (<FaCheck color="green" size={30} />)}
                <p className="text-[#bbb]  italic">Esto nos ayuda a validar el terreno y asignar maquinaria compatible</p>
                      </div>
              {errors.resguardo_files && <p className="text-red-500 text-sm">{errors.resguardo_files.message}</p>}
                </div>
              </div>
              </div>
              )
            }
             {
              project.has_reserve_space === "Otros" && (
                 <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 duration-300">
                <div className="w-full lg:w-1/2 flex flex-col gap-2">
                <Input
                  label="Descripción del espacio de reserva"
                  name="access_notes"
                  type="text"
                  placeHolder="Especifique el tipo de espacio de reserva"
                  register={register}
                  errors={errors}
                  labelClass=""
                  containerClass="flex flex-col gap-2"
                  inputClass="w-full h-[50px] rounded-sm px-4 py-2 border-[#bbb] border-1 focus:outline-none"
                  />
                  <p className="text-[#bbb] italic">Esto nos ayuda a validar el terreno y asignar maquinaria compatible</p>
                  </div>
                  </div>
              )
            }
           
           <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
            <div className="w-full lg:w-1/2 flex flex-col gap-2">
            <Input
              label="Acceso a la obra"
              name="access_terrain_condition"
              type="text"
              placeHolder="Describa el acceso al sitio"
              register={register}
              errors={errors}
              labelClass=""
              containerClass="flex w-full flex-col gap-2"
              inputClass="w-full h-[50px] rounded-sm px-4 py-2 border-[#bbb] border-1 focus:outline-none"
            />
            </div>
           </div>
           <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6"></div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl  mb-4">3. Otros detalles</h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
              <div className="w-full  lg:w-1/2 ">
              <Input
               label="Requisitos especiales"
              name="extra_requirements"
              type="text"
              placeHolder="Agrega datos adicionales"
              register={register}
              errors={errors}
              labelClass=""
              containerClass="flex w-full flex-col gap-2"
              inputClass="w-full h-[50px] rounded-sm px-4 py-2 border-[#bbb] border-1 focus:outline-none"
              />
              </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row  justify-end items-end pt-6 lg:w-1/2">
          <button type="submit" className={`border-1 border-secondary px-4 py-2 max-h-[50px] rounded-sm w-[200px] text-secondary duration-300 ${Object.keys(errors).length < 1 ? 'cursor-pointer hover:bg-secondary hover:text-white' : 'opacity-50 cursor-not-allowed'}`} disabled={Object.keys(errors).length > 0}>
               {sending ? (
            <ImSpinner8        
              size={20}
              className="animate-spin mx-auto "
            />
          ) : (
            <span>Guardar</span>
          )}
            </button>
        </div>
      </form>
    );
}