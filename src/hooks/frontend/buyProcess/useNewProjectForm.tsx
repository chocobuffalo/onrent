"use client";
import { useUIAppSelector } from "@/libs/redux/hooks";
import getProjects from "@/services/getProjects";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";


const Schema = Yup.object({
  end_date: Yup.string().required("Fecha de finalización es requerida"),
  name: Yup.string().required("Nombre es requerido"),
  location: Yup.string().required("Ubicación es requerida"),
  estimated_duration: Yup.string().required("Duración estimada es requerida"),
  start_date: Yup.string().required("Fecha de inicio es requerida"),
  responsible_name: Yup.string().required("Nombre del responsable es requerido"),
  work_schedule: Yup.string().required("Horario de trabajo es requerido"),
  site_manager: Yup.string().required("Nombre del encargado de obra es requerido"),
  manager_phone: Yup.string().required("Teléfono del encargado de obra es requerido"),
  work_type: Yup.string().required("Tipo de trabajo es requerido"),
  terrain_type: Yup.string().required("Tipo de terreno es requerido"),
  access_terrain_condition: Yup.string().required("Condición de acceso al terreno es requerida"),
  access_notes: Yup.string(),
  has_reserve_space: Yup.boolean().required(),
  extra_requirements: Yup.string(),
  observations: Yup.string(),
  state: Yup.string().default("planning"),
  resguardo_files: Yup.array().of(Yup.string())
})

export default function useNewProjectForm() {
const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(Schema),
    mode: "onChange",
  });
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({
    end_date: "",
    name: "",
    location: "",
    estimated_duration: "",
    start_date: "",
    responsible_name: "",
    work_schedule: "",
    site_manager: "",
    manager_phone: "",
    work_type: "",
    terrain_type: "",
    access_terrain_condition: "",
    access_notes: "",
    has_reserve_space: false,
    extra_requirements: "",
    observations: "",
    state: "planning",
    resguardo_files: [],
  })
  const session = useSession();
  const router = useRouter();
  console.log(session);
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
      }, [session.status]);
      const handlerStartDate = (date:string)=>{
        setProject(prev => ({ ...prev, start_date: date }));
      }
      const handlerEndDate = (date:string)=>{
        setProject(prev => ({ ...prev, end_date: date }));
      }

      return {
          register,
          handleSubmit,
          handlerEndDate,
          handlerStartDate,
          project,
          errors,
          isValid
      };
}


