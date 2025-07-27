'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';

const schema = Yup.object({
    name: Yup.string().required('Este campo es obligatorio'),
    tipoUsuario: Yup.string().required('Selecciona un tipo de usuario'),
    email: Yup.string().email('Formato de email inválido').required('Este campo es obligatorio'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña'),
});
export default function useRegister(){
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });
    
    const onSubmit = (data: any) => {
        console.log('Datos de registro:', data);
        alert('Registro simulado');
        setIsLoading(true);
        setTimeout(() => {
        setIsLoading(false);
        // Aquí podrías llamar a una función para manejar el registro real
        // Por ejemplo, usando signIn de next-auth
        // signIn('credentials', { ...data, redirect: false });
        }, 500);
    };
    
    return {
        errors,
        isValid,
        register,
        isLoading,
        handleSubmit,
        onSubmit,
    };
}