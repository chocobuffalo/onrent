'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CatalogueItem } from "@/components/organism/Catalogue/types";
import { useSession } from "next-auth/react";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export default function useMachineDetail(machineId: number,  projectId?: string) {
  const [extras, setExtras] = useState({
    operador: true,
    certificado: true,
    combustible: true,
  });

  const [saveAddress, setAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [machineData, setMachineData] = useState<CatalogueItem | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);

  const [workImage, setWorkImage] = useState<File | null>(null);
  const [workImageBase64, setWorkImageBase64] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [projectData, setProjectData] = useState<any>(null);
  const session = useSession();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL_ORIGIN;
        const url = apiBase
          ? `${apiBase}/api/catalog/${machineId}`
          : `/api/catalog/${machineId}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Producto no encontrado");

        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Producto no encontrado");
        }

        const processedMachine: CatalogueItem = {
          id: data.id,
          name: data.name || "Máquina sin nombre",
          location: data.location || "Ubicación no disponible",
          price: String(data.list_price ?? "0"),
          image: data.image || "/images/catalogue/machine5.jpg",
          machinetype: data.machine_category || "maquinaria",
          machine_category: data.machine_category || "other",
          description: data.description || "",
          specs: data.specs || null,
          pricing: data.pricing || null,
        };

        setMachineData(processedMachine);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Hubo un problema al cargar la información");
        setMachineData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [machineId]);

useEffect(() => {
  if (projectId && session && session.status === "authenticated") {
    const fetchProjectData = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL_ORIGIN;
        
        const accessToken = (session.data as (typeof session.data & { accessToken?: string }))?.accessToken || "";
        
        const res = await fetch(`${apiBase}/api/project/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          cache: 'no-cache'
        });
        
        if (!res.ok) {
          return;
        }
        
        const projectInfo = await res.json();
        
        setProjectData(projectInfo);
        
        if (projectInfo.name) {
          setProjectName(projectInfo.name);
        }
        if (projectInfo.responsible_name) {
          setResponsibleName(projectInfo.responsible_name);
        }

        if (projectInfo.location) {
          let lat = 0;
          let lng = 0;
          
          if (projectInfo.location_lat) {
            lat = typeof projectInfo.location_lat === 'string' 
              ? parseFloat(projectInfo.location_lat) 
              : projectInfo.location_lat;
          }
          
          if (projectInfo.location_lng) {
            lng = typeof projectInfo.location_lng === 'string' 
              ? parseFloat(projectInfo.location_lng) 
              : projectInfo.location_lng;
          }
          
          const locationData = {
            lat: lat,
            lng: lng,
            address: projectInfo.location
          };
          
          if (lat !== 0 || lng !== 0) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('selectedLocation');
            }
            
            setSelectedLocation(locationData);
          } else {
            setSelectedLocation({
              lat: 0,
              lng: 0,
              address: projectInfo.location
            });
          }
        }
        
      } catch (error) {
        // Silently handle error
      }
    };

    fetchProjectData();
  }
}, [projectId, session?.status]);

  const toggleExtra = (key: keyof typeof extras) => {
    setExtras((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSaveAddress = () => {
    setAddress(!saveAddress);
  };

  const handleLocationSelect = (locationData: LocationData | { lat: number; lng: number }, address?: string) => {
    let coordinates: LocationData;

    if ('address' in locationData) {
      coordinates = locationData;
    } else {
      coordinates = {
        lat: locationData.lat,
        lng: locationData.lng,
        address
      };
    }

    setSelectedLocation({
      lat: coordinates.lat,
      lng: coordinates.lng,
      address: coordinates.address
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLocation', JSON.stringify({
        lat: coordinates.lat,
        lng: coordinates.lng,
        address: coordinates.address
      }));
    }

    if (error && error.includes('ubicación')) {
      setError(null);
    }
  };

  const getLocationForBooking = () => {
    if (selectedLocation) {
      if (selectedLocation.lat !== 0 || selectedLocation.lng !== 0) {
        return {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng
        };
      } 
      else if (projectId && selectedLocation.address) {
        return {
          lat: 0,
          lng: 0
        };
      }
    }
    
    return null;
  };

  const validateLocation = () => {
    if (!selectedLocation) {
      setError('Por favor selecciona una ubicación en el mapa');
      return false;
    }

    if (selectedLocation.lat === 0 && selectedLocation.lng === 0) {
      if (projectId && selectedLocation.address) {
        setError(null);
        return true;
      } else {
        setError('Por favor selecciona una ubicación válida en el mapa');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedLocation');
    }

    if (error && error.includes('ubicación')) {
      setError(null);
    }
  };

  const handleImageChange = (file: File) => {
    setWorkImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setWorkImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const clearWorkImage = () => {
    setWorkImage(null);
    setWorkImageBase64(null);
  };

  const getWorkData = () => {
    return {
      workImage: workImageBase64,
      projectName: projectData?.name || projectName,
      referenceAddress: projectData?.location || selectedLocation?.address || projectName || '',
      projectId: projectData?.id || 0,
    };
  };

 useEffect(() => {
  if (typeof window !== 'undefined' && !projectId) {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setSelectedLocation(parsedLocation);
      } catch (error) {
        // Silently handle parsing error
      }
    }
  }
}, [projectId]);

  return {
    extras,
    saveAddress,
    toggleExtra,
    toggleSaveAddress,
    router,
    error,
    loading,
    selectedLocation,
    handleLocationSelect,
    getLocationForBooking,
    validateLocation,
    clearLocation,
    machineData,
    workImage,
    workImageBase64,
    projectName,
    setProjectName,
    responsibleName,
    setResponsibleName, 
    handleImageChange,
    clearWorkImage,
    getWorkData,
    projectData,
  };
}