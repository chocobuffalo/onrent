"use client";

import React from "react";


// import { useForm, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import Input from "@/components/atoms/Input/Input";
// import SecretInput from "@/components/atoms/secretInput/secretInput";
// import { ImSpinner8 } from "react-icons/im";

// const schema = z.object({
//   email: z.string().email("Correo inválido"),
//   password: z.string().min(6, "Mínimo 6 caracteres"),
// });

// type FormValues = z.infer<typeof schema>;

export default function RecuperarPage() {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isSubmitting },
  // } = useForm<FormValues>({
  //   resolver: zodResolver(schema),
  // });

  // const onSubmit: SubmitHandler<FormValues> = (data) => {
  //   console.log("Credenciales:", data);
  //   alert("Inicio de sesión simulado");
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-xl px-16 py-16 text-center">
        <h1 className="text-lg font-semibold mb-6">Recuperar contraseña</h1>
        <p className="text-gray-600 text-sm">
          Esta funcionalidad está en construcción.  
          Muy pronto podrás recuperar tu contraseña desde aquí.
        </p>
      </div>
    </div>
  );
}
