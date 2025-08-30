"use client";
import { useUIAppSelector } from "@/libs/redux/hooks";
import createProject from "@/services/createProject";
import { getLocationList } from "@/services/getLocationList.adapter";
import getProjects from "@/services/getProjects";
import { SelectInterface } from "@/types/iu";
import { countDays, fixDate } from "@/utils/compareDate";
import { debounce } from "@/utils/debounce";
import { chanceDateFormat, reverseChangeDateFormat } from "@/utils/formatDate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import * as Yup from "yup";
import { useToast } from "../ui/useToast";
import { FileInterface } from "@/types";
import getProjectDetail from "@/services/getProjectDetail";
import { machine } from "os";


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
  machinery_type: Yup.string(),
  resguardo_files: Yup.array(),
})

const initialValues = {
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
    machinery_type: ""
  }

export default function useNewProjectForm({projectId}:{projectId?:string}) {
const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    setValue,
    watch,
    reset,
    clearErrors
  } = useForm({
    resolver: yupResolver(Schema),
    mode: "onChange",
  });
  const [sending, setSending] = useState(false);
  const { toastSuccess, toastError } = useToast();
  
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
    resguardo_files: FileInterface[];
    machinery_type:string;
  };

  const [project, setProject] = useState<ProjectState>(initialValues)
  const [terrainType, setTerrainType] = useState<string[]>([]);
  const session = useSession();
  const router = useRouter();

  

    const convertFileToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          //console.log(file);
          //remove data:image/png;base64, del  string
          const base64String = reader.result as string;
          const content_base64 = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
        const createImage ={
            filename: file.name,
            content_base64: content_base64 as string,
            mimetype: file.type
        }
        //console.log(createImage);

        //si el archivo pesa menos de 5MB
        if (file.size < 5 * 1024 * 1024 && file.type.startsWith("image/")) {
          setValue("resguardo_files", [createImage]);
          setProject(prev => ({ ...prev, resguardo_files:[createImage] }));
        } else {
          setError("resguardo_files", { type: "manual", message: "El archivo es demasiado grande. Máximo 5MB o tipo de archivo no válido" });
        }
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
    if(projectId){
       const accessToken = (session.data as (typeof session.data & { accessToken?: string }))?.accessToken

      getProjectDetail(projectId, accessToken || "").then(data=>{
        console.log(data);
        if(data.error){
          console.error("Error fetching project details:", data.error);
        }else{
          const { name, responsible_name, start_date, end_date, estimated_duration, work_schedule, location, resguardo_files } = data;
          
          // startDate chance order yyyy-mm-dd to dd-mm-yyyy
          
          const formattedStartDate = reverseChangeDateFormat(start_date);
          const formattedEndDate = reverseChangeDateFormat(end_date);

          setProject({
            name: name || "",
            responsible_name: responsible_name || "",
            start_date: formattedStartDate || "",
            end_date: formattedEndDate || "",
            estimated_duration: estimated_duration || "",
            work_schedule: work_schedule || "",
            location: location || "",
            resguardo_files: resguardo_files || [],
            manager_phone: data.manager_phone || "",
            work_type: data.work_type || "",
            terrain_type: data.terrain_type || "",
            access_terrain_condition: data.access_terrain_condition || "",
            access_notes: data.access_notes || "",
            has_reserve_space: data.has_reserve_space == false ? "No" : data.access_notes!== ""? 'Otros' : "Si",
            extra_requirements: data.extra_requirements || "",
            observations: data.observations || "",
            state: data.state || "planning",
            machinery_type: data.machinery_type || ""
          });
          setTerrainType(data.terrain_type ? data.terrain_type.split(", ").map((item:string) => item.trim()) : []);
          setValue("resguardo_files", data.resguardo_files || []);
          setValue("name", name || "");
          setValue("responsible_name", responsible_name || "");
          setValue("start_date", start_date || "");
          setValue("end_date", end_date || "");
          setValue("estimated_duration", estimated_duration || "");
          setValue("work_schedule", work_schedule || "");
          setValue("location", location || "");
          setValue("manager_phone", data.manager_phone || "");
          setValue("work_type", data.work_type || "");
          setValue("terrain_type", data.terrain_type || "");
          setValue("access_terrain_condition", data.access_terrain_condition || "");
          setValue("access_notes", data.access_notes || "");
          setValue("has_reserve_space", data.has_reserve_space || "");
          setValue("extra_requirements", data.extra_requirements || "");
          setValue("observations", data.observations || "");
          setValue("state", data.state || "planning");
          setValue("resguardo_files", data.resguardo_files || []);
          setValue("terrain_type", data.terrain_type || "");
          setValue("has_reserve_space", data.has_reserve_space == false ? "No" : data.access_notes!== ""? 'Otros' : "Si");
          setValue("machinery_type", data.machinery_type || "");
          clearErrors();

        }
      });
    }
  },[])

  useEffect(()=>{
    if(project.end_date !==''){
      clearErrors("end_date");
    }
  },[project.end_date])


  useEffect(()=>{
    if(project.location !==''){
      clearErrors("location");
    }
  },[project.location])

  useEffect(()=>{
    if(project.resguardo_files && project.resguardo_files.length > 0){
      clearErrors("resguardo_files");
    }
  },[project.resguardo_files])

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
                // const accessToken = (session.data as (typeof session.data & { accessToken?: string }))?.accessToken;
                // if (typeof accessToken === "string") {
                //     getProjects(accessToken).then(data=>console.log(data));
                // }
                
          }
      }, [session.status,project.start_date, project.end_date]);


  useEffect(()=>{
    setValue("terrain_type", terrainType.join(", "));
    setProject(prev => ({ ...prev, terrain_type: terrainType.join(", ") }));
  },[terrainType])

  
  //submit event
  const onSubmit = (data:any) => {
        console.log(data);
        setSending(true);
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
        if(project.has_reserve_space=='Si'){
          newProject.has_reserve_space = true;
        }else{
          newProject.has_reserve_space = false;
        }


        console.log(newProject);

        createProject(newProject,(session.data as (typeof session.data & { accessToken?: string }))?.accessToken || "")
        .then(res=>{
          if(res.message =="Proyecto creado correctamente"){
            console.log(res);
            toastSuccess(res.message);
            //limpiamos el formulario
            setProject(initialValues);
            setTerrainType([]);
            setValue("resguardo_files", []);
            reset();
          }else{
            console.log(res);
            toastError('hubo un error en la creación del proyecto');
          }
        }).finally(
          ()=>{
            setSending(false);
          }
        )
    


        
    


      }

      const reserves_types = ['Si','No', 'Otros']
      

      return {
          handlerFocus,
          register,
          isLoading,
          open,
          options,
          sending,
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


