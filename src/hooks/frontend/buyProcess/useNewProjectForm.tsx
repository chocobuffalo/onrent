"use client";
import { useUIAppSelector } from "@/libs/redux/hooks";
import createProject from "@/services/createProject";
import getProjects from "@/services/getProjects";
import { countDays } from "@/utils/compareDate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import * as Yup from "yup";


const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
const Schema = Yup.object({
  end_date: Yup.string(),
  name: Yup.string(),
  location: Yup.string(),
  estimated_duration: Yup.string(),
  start_date: Yup.string(),
  responsible_name: Yup.string().required("Este campo es requerido"),
  work_schedule: Yup.string().required("Este campo es requerido"),
  site_manager: Yup.string(),
  manager_phone: Yup.string().required("Este campo es requerido").matches(phoneRegExp, 'Número de teléfono no válido'),
  work_type: Yup.string().required("Este campo es requerido"),
  terrain_type: Yup.string(),
  access_terrain_condition: Yup.string(),
  access_notes: Yup.string(),
  has_reserve_space: Yup.string(),
  extra_requirements: Yup.string(),
  observations: Yup.string(),
  state: Yup.string().default("planning"),
  resguardo_files: Yup.string().default(""),
})

export default function useNewProjectForm() {
const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    setValue,
    watch,
    clearErrors
  } = useForm({
    resolver: yupResolver(Schema),
    mode: "onChange",
  });
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({
    end_date: "", // Fecha de fin de la obra
    name: "", // Nombre del proyecto
    location: "", // Ubicación de la obra
    estimated_duration: "1", // Duración estimada
    start_date: "", // Fecha de inicio de la obra
    responsible_name: "", // Nombre del responsable
    manager_phone: "", // Teléfono del encargado de obra
    work_schedule: "", // Horario de trabajo
    //site_manager: "", // 
    work_type: "", // Tipo de trabajo
    terrain_type: "", // Tipo de terreno
    access_terrain_condition: "", // Condición de acceso al terreno
    access_notes: "", // Notas de acceso
    has_reserve_space: "",// tiene espacio de reserva
    extra_requirements: "", // Requisitos adicionales
    observations: "", // Observaciones
    state: "planning", // Estado del proyecto
    resguardo_files: [],
  })
  const [terrainType, setTerrainType] = useState<string[]>([]);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
          if( typeof window !== "undefined"){
              if (session.status !== "authenticated") {
                  router.push("/iniciar-session");
              }
                const accessToken = (session.data as (typeof session.data & { accessToken?: string }))?.accessToken;
                if (typeof accessToken === "string") {
                    getProjects(accessToken).then(data=>console.log(data));
                }
                
          }
      }, [session.status,project.start_date, project.end_date]);


  useEffect(()=>{
     setProject(prev => ({ ...prev, terrain_type: terrainType.join(", ") }));
  },[terrainType])

    useEffect(() => {
    Object.entries(project).forEach(([key, value]) => {
      // Convert arrays to strings if needed
      const safeValue = Array.isArray(value) ? value.join(", ") : value;
      setValue(key as keyof typeof project, safeValue);
    });
  }, [project, setValue]);

  // Observar cambios del formulario y actualizar el estado
  const formValues = watch();


  const handlerWorkSchedule = (startDate:any, endDate:any) => {
    const dayLength = countDays(startDate, endDate) + 1;
    setProject(prev => ({ ...prev, estimated_duration: dayLength.toString() }));
  }

  const handlerStartDate = (date:string)=>{
    setProject(prev => ({ ...prev, start_date: date }));
    clearErrors("start_date");
  }
  const handlerEndDate = (date:string)=>{       
    setProject(prev => ({ ...prev, end_date: date }));
    clearErrors("end_date");
  }
  
  useEffect(()=>{
    if(project.end_date !==''){
      clearErrors("end_date");
    }
  },[project.end_date])

  useEffect(()=>{
    if(project.start_date !==''){
      clearErrors("start_date");
    }
  },[project.start_date])


  const onSubmit = (data:any) => {
        console.log(data);
        //revisarmos los errores
      
        // project 
        // aqui esta llegando un estado previo

        const newProject = data;


        // createProject(newProject,(session.data as (typeof session.data & { accessToken?: string }))?.accessToken || "")
        // .then(res=>res.json())
        // .then(res=>{
        //   console.log(res);
        // })
    


        
    


      }

      const reserves_types = ['Si','No', 'Otros']
      

      return {
          register,
          handleSubmit,
          handlerStartDate,
          handlerEndDate,
          clearErrors,
          handlerWorkSchedule,
          reserves_types,
          project,
          errors,
          terrainType, 
          setTerrainType,
          onSubmit,
          setProject,
          isValid
      };
}


