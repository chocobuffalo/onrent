'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CatalogueItem } from "@/components/organism/Catalogue/types";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export default function useMachineDetail(machineId: number) {
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

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL_ORIGIN;
        const url = apiBase
          ? `${apiBase}/api/catalog/${machineId}`
          : `/api/catalog/${machineId}`;

        console.log("🔍 URL de petición MachineDetail:", url);

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

    console.log('Ubicación seleccionada:', coordinates);
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
      return {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      };
    }
    return null;
  };

  const validateLocation = () => {
    if (!selectedLocation) {
      setError('Por favor selecciona una ubicación en el mapa');
      return false;
    }

    if (selectedLocation.lat === 0 && selectedLocation.lng === 0) {
      setError('Por favor selecciona una ubicación válida en el mapa');
      return false;
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation);
          setSelectedLocation(parsedLocation);
        } catch (error) {
          console.error('Error parsing saved location:', error);
        }
      }
    }
  }, []);

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
  };
}
