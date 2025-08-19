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

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
        try {
        const res = await fetch(`/api/catalog/${machineId}`);
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

  return {
    extras,
    saveAddress,
    toggleExtra,
    toggleSaveAddress,
    router,
    error,
    loading
  };
}
