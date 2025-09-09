"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import changePass from "@/services/chancePass";
import { useToast } from "../frontend/ui/useToast";

const schema = Yup.object({
  newPassword: Yup.string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
    .matches(/\d/, "Debe contener al menos un número")
    .required("Nueva contraseña es requerida"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Las contraseñas deben coincidir")
    .required("Confirmar contraseña es requerido"),
});

export default function useChangePass() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [token,setToken] = useState('');
  const {data:user} = useSession()
  const {toastSuccess,
    toastError} = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });


  
// console.log(user," user en useChangePass");
  useEffect(()=>{
    setToken(user?.user?.access_token || '');
    setEmail(user?.user?.email || '');
  },[user?.user?.access_token])



  const onSubmit = async (data:any) => {
    setIsLoading(true);

    try{
      const newPass = await changePass({newPass:data.newPassword,email,token});
      
      toastSuccess("Contraseña actualizada con éxito");
      reset({
        newPassword: '',
        confirmPassword: ''
      });

    }catch(error){
      toastError("Error al actualizar la contraseña");
      console.error("Error updating password:", error);
    }finally{
      setIsLoading(false);
    };
  };
 

  return {
    onSubmit,
    errors,
    handleSubmit,
    register,
    isValid,
    isLoading,
  };
}
