"use client";
import { useUIAppSelector } from "@/libs/redux/hooks";
import getProjects from "@/services/getProjects";
import { countDays } from "@/utils/compareDate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import * as Yup from "yup";


const Schema = Yup.object({
  end_date: Yup.string(),
  name: Yup.string(),
  location: Yup.string(),
  estimated_duration: Yup.string(),
  start_date: Yup.string(),
  responsible_name: Yup.string(),
  work_schedule: Yup.string().required("Este campo es requerido"),
  site_manager: Yup.string(),
  manager_phone: Yup.string().required("Este campo es requerido"),
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



      


      const onSubmit = (data:any) => {
        console.log(data);
        //revisarmos los errores
        if(data.name ===''){
          setError("name", {
            type: "manual",
            message: "Este campo es requerido"
          });
        }
        if(data.responsible_name ===''){
          setError("responsible_name", {
            type: "manual",
            message: "Este campo es requerido"
          });
  
        }
        if(data.start_date ===''){
          setError("start_date", {
            type: "manual",
            message: "Este campo es requerido"
          });
  
        }
        if(data.end_date ===''){
          setError("end_date", {
            type: "manual",
            message: "Este campo es requerido"
          });
  
        }


        
    


      }

      const reserves_types = ['Si','No', 'Otros']
      

      return {
          register,
          handleSubmit,
        clearErrors,
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


