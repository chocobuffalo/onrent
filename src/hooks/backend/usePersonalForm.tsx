import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useUIAppDispatch } from "@/libs/redux/hooks";
import { useSession } from "next-auth/react";
import setProfileForm from "@/services/setProfileForm";
import { getRegionsList, updateUserRegion } from "@/services/getRegions";
import getProfile from "@/services/getProfile";
import { setName, setPhone } from "@/libs/redux/features/auth/authSlicer";
import { Region } from "@/types/profile";
import { toast } from "react-toastify";

const schema = Yup.object({
  fullName: Yup.string().required("Nombres y apellidos son requeridos"),
  telephone: Yup.string().required("Teléfono es requerido"),
  regionId: Yup.number().nullable(),
  curp: Yup.string().when('$showOperator', {
    is: true,
    then: (schema) => schema.required("CURP es requerido").length(18, "CURP debe tener 18 caracteres"),
    otherwise: (schema) => schema.notRequired(),
  }),
  licenseNumber: Yup.string().when('$showOperator', {
    is: true,
    then: (schema) => schema.required("Número de licencia es requerido"),
    otherwise: (schema) => schema.notRequired(),
  }),
  licenseType: Yup.string().when('$showOperator', {
    is: true,
    then: (schema) => schema.required("Tipo de licencia es requerido"),
    otherwise: (schema) => schema.notRequired(),
  }),
  experienceYears: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .when('$showOperator', {
      is: true,
      then: (schema) => schema
        .required("Años de experiencia son requeridos")
        .min(0, "Debe ser un número positivo")
        .integer("Debe ser un número entero"),
      otherwise: (schema) => schema.notRequired(),
    }),
  experienceLevel: Yup.string().when('$showOperator', {
    is: true,
    then: (schema) => schema.required("Nivel de experiencia es requerido"),
    otherwise: (schema) => schema.notRequired(),
  }),
  trainingStatus: Yup.string().when('$showOperator', {
    is: true,
    then: (schema) => schema.required("Estado de capacitación es requerido"),
    otherwise: (schema) => schema.notRequired(),
  }),
  hasEpp: Yup.boolean(),
  availability: Yup.string().when('$showOperator', {
    is: true,
    then: (schema) => schema.required("Disponibilidad es requerida"),
    otherwise: (schema) => schema.notRequired(),
  }),
  gpsLat: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .nullable(),
  gpsLng: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .nullable(),
    providerId: Yup.number().nullable(),
    compatibleMachinesIds: Yup.array().of(Yup.number()).nullable(),
});

interface UsePersonalFormProps {
  showOperatorForm: boolean;
  onOperatorFormReset: () => void;
}

export default function usePersonalForm({ showOperatorForm, onOperatorFormReset }: UsePersonalFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cityError, setCityError] = useState(false);
  const [licenseTypes, setLicenseTypes] = useState<[string, string][]>([]);
  const [experienceLevels, setExperienceLevels] = useState<[string, string][]>([]);
  const [trainingStatuses, setTrainingStatuses] = useState<[string, string][]>([]);
  const [availabilities, setAvailabilities] = useState<[string, string][]>([]);
  const [providers, setProviders] = useState<{id:number; name:string}[]>([]);
  const [machines, setMachines] = useState<{id:number; name:string}[]>([]);
  const [initialValues, setInitialValues] = useState({
    fullName: "",
    telephone: "",
    regionId: null as number | null,
    curp: "",
    licenseNumber: "",
    licenseType: "",
    experienceYears: 0,
    experienceLevel: "",
    trainingStatus: "",
    hasEpp: false,
    availability: "",
    gpsLat: 0,
    gpsLng: 0,
    providerId: null as number | null, 
    compatibleMachinesIds: [] as number[], 
  });
  
  const dispatch = useUIAppDispatch();
  const {data:session} = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    context: { showOperator: showOperatorForm }
  });

  useEffect(() => {
    if (showOperatorForm && 'geolocation' in navigator) {
      setLocationStatus('loading');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setValue('gpsLat', lat);
          setValue('gpsLng', lng);
          setLocationStatus('success');
          
          console.log('📍 Ubicación obtenida:', { lat, lng });
          toast.success('Ubicación obtenida correctamente');
        },
        (error) => {
          console.error('❌ Error obteniendo ubicación:', error);
          setLocationStatus('error');
          
          setValue('gpsLat', 0);
          setValue('gpsLng', 0);
          
          toast.error('No se pudo obtener la ubicación. Por favor, permite el acceso a tu ubicación.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else if (showOperatorForm && !('geolocation' in navigator)) {
      setLocationStatus('error');
      toast.error('Tu navegador no soporta geolocalización');
    }
  }, [showOperatorForm, setValue]);

  const syncProfileToForm = (profileData: any) => {
    const fullName = profileData.name || "";
    const telephone = profileData.phone || "";
    const regionId = profileData?.region?.id || null;
    const curp = profileData.curp || "";
    const licenseNumber = profileData.license_number || "";
    const licenseType = profileData.license_type || "";
    const experienceYears = profileData.experience_years || 0;
    const experienceLevel = profileData.experience_level || "";
    const trainingStatus = profileData.training_status || "";
    const hasEpp = profileData.has_epp || false;
    const availability = profileData.availability || "";
    const gpsLat = profileData.gps_lat || 0;
    const gpsLng = profileData.gps_lng || 0;
    const providerId = profileData?.provider?.id || null;
    const compatibleMachinesIds = profileData?.compatible_machines_ids?.map((m:any)=>m.id) || [];

    setValue("fullName", fullName);
    setValue("telephone", telephone);
    setValue("curp", curp);
    setValue("licenseNumber", licenseNumber);
    setValue("licenseType", licenseType);
    setValue("experienceYears", experienceYears);
    setValue("experienceLevel", experienceLevel);
    setValue("trainingStatus", trainingStatus);
    setValue("hasEpp", hasEpp);
    setValue("availability", availability);
    setValue("gpsLat", gpsLat);
    setValue("gpsLng", gpsLng);
    setValue("providerId", providerId);
    setValue("compatibleMachinesIds", compatibleMachinesIds);
    setSelectedRegion(regionId);
    
    setInitialValues({
      fullName,
      telephone,
      regionId,
      curp,
      licenseNumber,
      licenseType,
      experienceYears,
      experienceLevel,
      trainingStatus,
      hasEpp,
      availability,
      gpsLat,
      gpsLng,
      providerId,
      compatibleMachinesIds,
    });

    dispatch(setName(fullName));
    dispatch(setPhone(telephone));
  };

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.access_token) return;

      setIsLoadingRegions(true);
      try {
        const regionsResponse = await getRegionsList(session.user.access_token);
        if (regionsResponse.success && regionsResponse.data) {
          setRegions(regionsResponse.data);
        } else {
          toast.error(regionsResponse.message);
        }

        const profileResponse = await getProfile(session.user.access_token);
        if (profileResponse) {
          syncProfileToForm(profileResponse);
        }

        // opciones de operador
        const optionsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/operator/options`, {
          headers: { Authorization: `Bearer ${session.user.access_token}` }
        }).then(r => r.json());
        setLicenseTypes(optionsRes.license_types || []);
        setExperienceLevels(optionsRes.experience_levels || []);
        setTrainingStatuses(optionsRes.training_statuses || []);
        setAvailabilities(optionsRes.availabilities || []);

        // proveedores
        const providersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/providers`, {
          headers: { Authorization: `Bearer ${session.user.access_token}` }
        }).then(r => r.json());
        setProviders(providersRes || []);

        // máquinas
        const machinesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/client/profile/machines`, {
          headers: { Authorization: `Bearer ${session.user.access_token}` }
        }).then(r => r.json());
        setMachines(machinesRes || []);

      } catch (error) {
        toast.error("Error al cargar la información");
      } finally {
        setIsLoadingRegions(false);
      }
    };

    loadData();
  }, [session?.user?.access_token]);

  const onSubmit = async (data: any) => {
    if (!session?.user?.access_token) return;

    setIsLoading(true);
    try {
      const updateData: any = {
        token: session.user.access_token,
        fullName: data.fullName,
        telephone: data.telephone,
      };

      if (showOperatorForm) {
        updateData.curp = data.curp;
        updateData.licenseNumber = data.licenseNumber;
        updateData.licenseType = data.licenseType;
        updateData.experienceYears = Number(data.experienceYears);
        updateData.experienceLevel = data.experienceLevel;
        updateData.trainingStatus = data.trainingStatus;
        updateData.hasEpp = data.hasEpp;
        updateData.availability = data.availability;
        updateData.gpsLat = Number(data.gpsLat) || 0;
        updateData.gpsLng = Number(data.gpsLng) || 0;
        updateData.providerId = data.providerId || null;                   
        updateData.compatibleMachinesIds = data.compatibleMachinesIds || [];
      }

      const userProfile = await setProfileForm(updateData);
      console.log("Información actualizada:", userProfile);

      if (selectedRegion !== initialValues.regionId && selectedRegion !== null) {
        const regionResponse = await updateUserRegion(session.user.access_token, {
          regionId: selectedRegion
        });

        if (!regionResponse.success) {
          toast.error(regionResponse.message);
          setIsLoading(false);
          return;
        }
        console.log("Región actualizada:", regionResponse);
      }

      const updatedProfile = await getProfile(session.user.access_token);
      if (updatedProfile) {
        syncProfileToForm(updatedProfile);
      }

      if (showOperatorForm) {
        setValue("curp", "");
        setValue("licenseNumber", "");
        setValue("licenseType", "");
        setValue("experienceYears", 0);
        setValue("experienceLevel", "");
        setValue("trainingStatus", "");
        setValue("hasEpp", false);
        setValue("availability", "");
        setValue("gpsLat", 0);
        setValue("gpsLng", 0);
        setLocationStatus('idle');
        
        onOperatorFormReset();
      }
      
      toast.success("Perfil actualizado con éxito");
    } catch (error) {
      toast.error("Error al actualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    const currentValues = {
      fullName: watch("fullName") || "",
      telephone: watch("telephone") || "",
      regionId: selectedRegion,
      curp: showOperatorForm ? (watch("curp") || "") : "",
      licenseNumber: showOperatorForm ? (watch("licenseNumber") || "") : "",
      licenseType: showOperatorForm ? (watch("licenseType") || "") : "",
      experienceYears: showOperatorForm ? (Number(watch("experienceYears")) || 0) : 0,
      experienceLevel: showOperatorForm ? (watch("experienceLevel") || "") : "",
      trainingStatus: showOperatorForm ? (watch("trainingStatus") || "") : "",
      hasEpp: showOperatorForm ? (watch("hasEpp") || false) : false,
      availability: showOperatorForm ? (watch("availability") || "") : "",
      gpsLat: showOperatorForm ? (Number(watch("gpsLat")) || 0) : 0,
      gpsLng: showOperatorForm ? (Number(watch("gpsLng")) || 0) : 0,
    };

    return JSON.stringify(currentValues) !== JSON.stringify(initialValues);
  };

  return {
    onSubmit,
    errors,
    handleSubmit,
    register,
    isValid,
    authEmail: session?.user?.email || "",
    isLoading,
    regions,
    isLoadingRegions,
    selectedRegion,
    setSelectedRegion,
    hasChanges,
    locationStatus,
    cityError,
    setCityError,
    initialValues,
    licenseTypes,
    experienceLevels,
    trainingStatuses,
    availabilities,
    providers,
    machines,
  };
}
