"use client";
// import Select from 'react-select'
import { userRoles } from "@/constants/user";
import useRegister from "@/hooks/frontend/auth/register/useRegister";
import { signIn } from "next-auth/react";
import { ImSpinner8 } from "react-icons/im";
import SecretInput from "@/components/atoms/secretInput/secretInput";
import Image from "next/image";

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
          <div>
            <label className="block mb-1">
              Nombre de Usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Introduce tu nombre de usuario"
              className="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
            />
            {errors.name && (
              <p className="text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          {/* Tipo de usuario */}
          <div>
            <label className="block mb-1">Tipo de usuario</label>
            <select
              {...register("tipoUsuario")}
              className="w-full rounded-md px-4 py-4 bg-[#E9E9E9] appearance-none focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Selecciona el tipo de usuario
              </option>
              {userRoles.map((role) => (
                <option key={role.id} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.tipoUsuario && (
              <p className="text-red-500 mt-1">{errors.tipoUsuario.message}</p>
            )}
          </div>

          {/* Correo / Teléfono */}
          <div>
            <label className="block mb-1">
              Correo electrónico<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("email")}
              placeholder="Introduce tu correo electrónico"
              className="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <SecretInput
            register={register}
            errors={errors}
            label="Contraseña"
            placeHolder="Mínimo 6 caracteres"
            id={"password"}
            classWrapper="form-group relative"
            inputClass="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
          />

          {/* Confirmar contraseña */}
          <SecretInput
            register={register}
            errors={errors}
            label="Confirmar Contraseña"
            placeHolder="Repite tu contraseña"
            id={"confirmPassword"}
            classWrapper="form-group relative"
            inputClass="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
          />

          {/* Botón Crear cuenta */}
          <button
            type="submit"
            className={`w-full py-4 rounded-md font-semibold text-white text-[12px] tracking-wide transition-colors ${
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
          <Image src="/icons/google.svg" alt="Google" className="w-5 h-5" />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
