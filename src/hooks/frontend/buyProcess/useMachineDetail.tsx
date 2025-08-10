'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; // <-- Importar router
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
const Schema = Yup.object({
    
});
export default function useMachineDetail(machineId: number) {
    const [extras, setExtras] = useState({
        operador: true,
        certificado: true,
        combustible: true,
    });

    const [saveAddress,setAddress] = useState(false);

    const router = useRouter(); // <-- Inicializar router

    const toggleExtra = (key: keyof typeof extras) => {
    setExtras((prev) => ({ ...prev, [key]: !prev[key] }));
    };
    const toggleSaveAddress = () => {
    setAddress(!saveAddress);
    }

    return{
        extras,
        saveAddress,
        toggleExtra,
        toggleSaveAddress,
        router, // <-- Retornar router para usar en el componente
    }


}