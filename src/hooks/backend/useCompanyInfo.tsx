'use client';

import { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useUIAppSelector } from "@/libs/redux/hooks";

const schema = Yup.object({
    companyName: Yup.string().required('El nombre de la empresa es requerido'),
    taxId: Yup.string().required('El NIT es requerido'),
    address: Yup.string().required('La dirección es requerida'),
    phone: Yup.string().required('El teléfono es requerido'),
    email: Yup.string().email('El correo electrónico no es válido').required('El correo electrónico es requerido'),
});

export default function useCompanyInfo() {
      const [isLoading, setIsLoading] = useState(false);
        const {
            register,
            handleSubmit,
            reset,
            formState: { errors, isValid },
        } = useForm({
            resolver: yupResolver(schema),
            mode: 'onBlur',
        });
        const onSubmit = async (data:any) => {
    
            setIsLoading(true);
            try {
                // Simulate an API call
            } catch (error) {
                console.error('Error submitting form:', error);
            } finally {
                setIsLoading(false);
            }
        }

    return {
        onSubmit,
        errors,
        handleSubmit,
        register,
        isValid,
       
        isLoading,
    };
}