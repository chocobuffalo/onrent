'use client';

import { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


const schema = Yup.object({
    fullName: Yup.string().required('Nombres y apellidos son requeridos'),
   
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Las contraseñas deben coincidir')
        .required('Confirmar contraseña es requerido'),
});


export default function usePersonalForm() {
    // This hook can be used to manage the state and logic for the profile form
    // For example, it can handle form submission, validation, and state management
    // Here we can return any necessary functions or state variables

    return {
        // Example return values
        handleSubmit: () => {},
        formState: {},
        errors: {}
    };
}