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
import { updateProject } from "@/services/updateProject";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface SearchResult {
  Place: {
    Label: string;
    Geometry: {
      Point: [number, number];
    };
  };
}

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
    end_date: "", 
    name: "",
    location: "",
    estimated_duration: "1",
    start_date: "",
    responsible_name: "",
    manager_phone: "",
    work_schedule: "", 
    work_type: "",
    terrain_type: "",
    access_terrain_condition: "",
    access_notes: "",
    has_reserve_space: "",
    extra_requirements: "",
    observations: "", 
    state: "planning",
    resguardo_files: [],
    machinery_type: ""
  }

export default function useNewProjectForm({
    projectId,
    projectAct,
    machineId,      
    machinetype     
}:{
    projectId?:string,
    projectAct?:()=>void,
    machineId?: string | null,    
    machinetype?: string | null   
}) {
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
  const [selectedLocationData, setSelectedLocationData] = useState<LocationData | null>(null);
  
  // Estados para búsqueda del mapa
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const session = useSession();
  const router = useRouter();

  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch('/api/get-map/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          center: [-123.115898, 49.295868] 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.Results || []);
        setShowResults((data.Results || []).length > 0);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce para la búsqueda
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      await searchPlaces(query);
    }, 500),
    []
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setValue("location", query);
    setProject(prev => ({ ...prev, location: query }));
    debouncedSearch(query);
  };

  const selectSearchResult = (result: SearchResult) => {
    const coords = result.Place.Geometry.Point;
    const fullAddress = result.Place.Label;
    
    setSearchQuery(fullAddress);
    setValue("location", fullAddress);
    setProject(prev => ({ ...prev, location: fullAddress }));
    setShowResults(false);
    setSearchResults([]);
    
    setSelectedLocationData({
      lat: coords[1],
      lng: coords[0],
      address: fullAddress
    });
  };

    const convertFileToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
        
          const base64String = reader.result as string;
          const content_base64 = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
        const createImage ={
            filename: file.name,
            content_base64: content_base64 as string,
            mimetype: file.type
        }

        if (file.size < 5 * 1024 * 1024 && file.type.startsWith("image/")) {
          setValue("resguardo_files", [createImage]);
          setProject(prev => ({ ...prev, resguardo_files:[createImage] }));
        } else {
          setError("resguardo_files", { type: "manual", message: "El archivo es demasiado grande. Máximo 5MB o tipo de archivo no válido" });
        }
        };
        reader.readAsDataURL(file);
    };
  
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

  useEffect(()=>{
    if(projectId){
       const accessToken = (session.data as (typeof session.data & { accessToken?: string }))?.accessToken

      getProjectDetail(projectId, accessToken || "").then(data=>{
        console.log(data);
        if(data.error){
          console.error("Error fetching project details:", data.error);
        }else{
          const { name, responsible_name, start_date, end_date, estimated_duration, work_schedule, location, resguardo_files } = data;
          
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
          setSearchQuery(location || "");
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
          }
      }, [session.status,project.start_date, project.end_date]);

  useEffect(()=>{
    setValue("terrain_type", terrainType.join(", "));
    setProject(prev => ({ ...prev, terrain_type: terrainType.join(", ") }));
  },[terrainType])
  
  const onSubmit = (data:any) => {
        console.log(data);
        setSending(true);

        const newProject = data;
        newProject.site_manager =""
        if(newProject.access_notes == undefined){
          newProject.access_notes = ""
        }
        newProject.observations = newProject.observations || "";
        if(project.has_reserve_space=='Si'){
          newProject.has_reserve_space = true;
        }else{
          newProject.has_reserve_space = false;
        }
        
        newProject.start_date = chanceDateFormat(newProject.start_date);
        newProject.end_date = chanceDateFormat(newProject.end_date);
        console.log(chanceDateFormat(newProject.end_date),newProject.end_date);
        console.log(newProject);
        if(projectId){
          updateProject({...newProject,start_date:chanceDateFormat(newProject.start_date),end_date:chanceDateFormat(newProject.end_date),id:projectId},(session.data as (typeof session.data & { accessToken?: string }))?.accessToken || "")
          .then(res=>{
            console.log(res);
            if(res.message =="Proyecto actualizado correctamente"){
              toastSuccess(res.message);
              if (projectAct) {
                projectAct();
              }
            }else{
              toastError('Hubo un error en la actualización del proyecto');
            }
          }).finally(
            ()=>{
              setSending(false);
               if (projectAct) {
                  projectAct();
                }
            }
          )
        }else{
          
            createProject(newProject,(session.data as (typeof session.data & { accessToken?: string }))?.accessToken || "")
            .then(res=>{
              if(res.message =="Proyecto creado correctamente"){
                console.log(res);
                toastSuccess(res.message);
                
                setTimeout(() => {
                    if (typeof window !== 'undefined') {
                        if (machineId && machinetype) {
                            router.push(`/${machineId}?projectId=${res.project_id}`);
                        }
                        else {
                            const currentPath = window.location.pathname;
                            const machineBasePath = currentPath.replace('/nuevo-proyecto', '');
                            router.push(`${machineBasePath}?projectId=${res.project_id}`);
                        }
                    }
                }, 1500);
                
                setProject(initialValues);
                setTerrainType([]);
                setValue("resguardo_files", []);
               
                reset();
              }else{
                console.log(res);
                toastError('Hubo un error en la creación del proyecto');
              }
            }).finally(
              ()=>{
                setSending(false);
                 if (projectAct) {
                  projectAct();
                }
              }
            )
        }
    };

      const reserves_types = ['Si','No', 'Otros']
      
      return {
          register,
          sending,
          convertFileToBase64,
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
          isValid,
          searchQuery,
          setSearchQuery: handleSearchChange,
          searchResults,
          isSearching,
          showResults,
          setShowResults,
          selectSearchResult,
          selectedLocationData
      };
}