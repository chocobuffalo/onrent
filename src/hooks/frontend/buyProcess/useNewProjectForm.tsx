"use client";
import { useUIAppSelector } from "@/libs/redux/hooks";
import createProject from "@/services/createProject";
import { getLocationList } from "@/services/getLocationList.adapter";
import getProjects from "@/services/getProjects";
import { SelectInterface } from "@/types/iu";
import { countDays } from "@/utils/compareDate";
import { debounce } from "@/utils/debounce";
import { chanceDateFormat } from "@/utils/formatDate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
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
  resguardo_files: Yup.array().of(Yup.string()),
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
  type ProjectState = {
    end_date: string;
    name: string;
    location: string;
    estimated_duration: string;
    start_date: string;
    responsible_name: string;
    manager_phone: string;
    work_schedule: string;
    //site_manager?: string;
    work_type: string;
    terrain_type: string;
    access_terrain_condition: string;
    access_notes: string;
    has_reserve_space: string;
    extra_requirements: string;
    observations: string;
    state: string;
    resguardo_files: string[];
  };

  const [project, setProject] = useState<ProjectState>({
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

  

    const convertFileToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
        setValue("resguardo_files", [reader.result] as string[]);
        setProject(prev => ({ ...prev, resguardo_files:[reader.result] as string[]  }));
        };
        reader.readAsDataURL(file);
        // guardar el archivo en base64 en el estado
    };
  

  // Observar cambios del formulario y actualizar el estado
  const formValues = watch();


  const handlerWorkSchedule = (startDate:any, endDate:any) => {
    const dayLength = countDays(startDate, endDate) + 1;
    setValue("estimated_duration", dayLength.toString());
    setProject(prev => ({ ...prev, estimated_duration: dayLength.toString() }));
  }

  const handlerStartDate = (date:string)=>{
    setValue("start_date", date);
    setProject(prev => ({ ...prev, start_date: date }));
    clearErrors("start_date");
  }
  const handlerEndDate = (date:string)=>{  
    setValue("end_date", date);     
    setProject(prev => ({ ...prev, end_date: date }));
    clearErrors("end_date");
  }

  
  //Location don work other location
  const [isLoading, setIsLoading] = useState(false);
      
  const [options, setOptions] = useState<SelectInterface[]>([]);
  const [open, setOpen] = useState(false);
  
  const debouncedFilterColors = useCallback(
          debounce(async (inputValue: string) => {
            setIsLoading(true);
            try {
              const res = await getLocationList(inputValue || "Ciudad de Mexico");
              setOptions(res);
              setIsLoading(false);
              return res;
            } catch (error) {
              console.error("Error filtering colors:", error);
              setIsLoading(false);
              return options;
            }
          }, 500), // 500ms de delay
          [] // Dependencias vacías ya que no usamos variables externas
        );
      const handlerFocus = (text: string) => {
          debouncedFilterColors(text);
          setOpen(true);
      };
  
       const handlerInputChange = (text: string) => {
          debouncedFilterColors(text);
          setValue("location", text);
          setProject(prev => ({ ...prev, location: text }));
      };
      //setLocation,setType
    const handlerChange = (optionSelected: string) => {
      setValue("location", optionSelected);
      setProject(prev => ({ ...prev, location: optionSelected }));
      setOpen(false);
    };


  //clear Error with useEffect because useState is asinc
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
    setValue("terrain_type", terrainType.join(", "));
    setProject(prev => ({ ...prev, terrain_type: terrainType.join(", ") }));
  },[terrainType])

  
  //submit event
  const onSubmit = (data:any) => {
        console.log(data);
        //revisarmos los errores
      
        // project 
        // aqui esta llegando un estado previo

        const newProject = data;
        newProject.site_manager =""
        if(newProject.access_notes == undefined){
          newProject.access_notes = ""
        }
        newProject.observations = newProject.observations || "";
        newProject.start_date = chanceDateFormat(newProject.start_date);
        newProject.end_date = chanceDateFormat(newProject.end_date);


        console.log(newProject);

        createProject(newProject,(session.data as (typeof session.data & { accessToken?: string }))?.accessToken || "")
        .then(res=>console.log(res))
    


        
    


      }

      const reserves_types = ['Si','No', 'Otros']
      

      return {
          handlerFocus,
          register,
          isLoading,
          open,
          options,
          convertFileToBase64,
          handlerChange,
          handlerInputChange,
          handleSubmit,
          handlerStartDate,
          handlerEndDate,
          clearErrors,
          setValue,
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


