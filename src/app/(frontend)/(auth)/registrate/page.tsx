"use client";
// import Select from 'react-select'
import { userRoles } from "@/constants/user";
import useRegister from "@/hooks/frontend/auth/register/useRegister";
import { signIn } from "next-auth/react";
import { ImSpinner8 } from "react-icons/im";
import SecretInput from "@/components/atoms/secretInput/secretInput";
import Image from "next/image";
import Input from "@/components/atoms/Input/Input";
import SelectInput from "@/components/atoms/selectInput/selectInput";

export default function Registro() {
  const { errors, isValid, register, isLoading, handleSubmit, onSubmit } =
    useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-xl px-16 py-16">
        <h1 className="text-center text-black text-lg font-semibold mb-10">
          Registrarte
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 text-[12px] font-light text-gray-700"
        >
          {/* Nomber del usuario */}
            <Input
              type="text"
              register={register}
              placeHolder="Introduce tu nombre de usuario"
              containerClass="mb-2"
              inputClass="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
              label="Nombre de Usuario "
              labelClass="block mb-1"
              required
              errors={errors}
              name="name"
            />  
          {/* Tipo de usuario */}
          <SelectInput
            options={userRoles}
            name="tipoUsuario"
            
            register={register}
            label="Tipo de usuario"
            placeHolder="Selecciona el tipo de usuario"
            required
            classLabel="block mb-1"
            selectClass="w-full rounded-[4px] px-4 py-4 bg-[#E9E9E9] appearance-none focus:outline-none"
            containerClass="relative select-container mb-2"
            errors={errors}
          />

          {/* Correo / Teléfono */}
          <Input
            type="email"
            register={register}
            placeHolder="Introduce tu correo electrónico"
            inputClass="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
            label="Correo electrónico"
            labelClass="block mb-1"
            containerClass="mb-2"
            required
            errors={errors}
            name="email"
          />

          {/* Contraseña */}
          <SecretInput
            register={register}
            errors={errors}
            label="Contraseña"
            placeHolder="Mínimo 6 caracteres"
            id={"password"}
            classWrapper="form-group relative mb-2"
            inputClass="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
          />

          {/* Confirmar contraseña */}
          <SecretInput
            register={register}
            errors={errors}
            label="Confirmar Contraseña"
            placeHolder="Repite tu contraseña"
            id={"confirmPassword"}
            classWrapper="form-group relative mb-6"
            inputClass="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
          />

          {/* Botón Crear cuenta */}
          <button
            type="submit"
            className={`w-full py-4 rounded-md font-semibold text-white  text-[12px] tracking-wide transition-colors ${
              isValid
                ? "bg-[#1C1B3A] hover:bg-[#0f0f26]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!isValid}
          >
            {isLoading ? (
              <ImSpinner8
                color="#ffffff"
                size={20}
                className="animate-spin mx-auto"
              />
            ) : (
              <span>Crear cuenta</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-[12px] text-gray-400 font-light">
          o
        </div>

        {/* Google Login */}
        <button
          onClick={() =>
            signIn("google", { callbackUrl: "/dashboard/profile" })
          }
          className="hover:bg-[#0f0f26] hover:text-white w-full flex cursor-pointer items-center justify-center gap-3 bg-white border px-6 py-4 rounded-md shadow-sm hover:shadow-md transition text-[12px] font-light"
        >
          <Image src="/icons/google.svg" width={30} height={30} alt="Google" className="w-5 h-5" />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
