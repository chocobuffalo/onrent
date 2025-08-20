'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useMachineDetail(machineId: number) {
  const [extras, setExtras] = useState({
    operador: true,
    certificado: true,
    combustible: true,
  });

  const [saveAddress, setAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
        try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/catalog/${machineId}`);
        if (!res.ok) throw new Error("Producto no encontrado");

        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
            throw new Error("Producto no encontrado");
        }

        setError(null);
        } catch (err: any) {
        setError(err.message || "Hubo un problema al cargar la información");
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

  const handleLocationSelect = (coordinates: { lat: number; lng: number }, address?: string) => {
    console.log('Ubicación seleccionada:', coordinates, address);
    setSelectedLocation({
      lat: coordinates.lat,
      lng: coordinates.lng,
      address
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLocation', JSON.stringify({
        lat: coordinates.lat,
        lng: coordinates.lng,
        address
      }));
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
    setError(null);
    return true;
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('selectedLocation');
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
    clearLocation
  };
}
