'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const schema = Yup.object({
  emailOrPhone: Yup.string().required('Este campo es obligatorio'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
});

export default function IniciarSesion() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    console.log('Credenciales:', data);
    alert('Inicio de sesión simulado');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-xl px-16 py-16">
        <h1 className="text-center text-black text-lg font-semibold mb-10">Iniciar sesión para continuar</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[12px] font-light text-gray-700">
          {/* Email o Teléfono */}
          <div>
            <label className="block mb-1">Correo electrónico o teléfono <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register('emailOrPhone')}
              placeholder="Introduce tu correo electrónico o teléfono"
              className="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
            />
            {errors.emailOrPhone && (
              <p className="text-red-500 mt-1">{errors.emailOrPhone.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <SecretInput
            register={register}
            errors={errors}
            label="Contraseña"
            placeHolder="Contraseña"
            id={'password'}
            classWrapper="form-group relative"
            inputClass="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
          />
          {/* Botón Iniciar sesión */}
          <button
            type="submit"
            className={`w-full py-4 rounded-md font-semibold text-white text-[12px] tracking-wide transition-colors ${
              isValid
                ? 'bg-[#1C1B3A] hover:bg-[#0f0f26]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!isValid}
          >
            Iniciar sesión
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-[12px] text-gray-400 font-light">o</div>

        {/* Google Login */}
        <button onClick={() => signIn('google', { callbackUrl: "/dashboard", })} className=" hover:bg-[#0f0f26] hover:text-white w-full flex cursor-pointer items-center justify-center gap-3 bg-white border px-6 py-4 rounded-md shadow-sm hover:shadow-md transition text-[12px] font-light">
          <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
          Continuar con Google
        </button>

        {/* Links inferiores */}
        <div className="mt-8 text-center text-[12px] text-gray-700 font-light space-y-2">
          <p>
            ¿No tienes una cuenta? <Link href="/registrate" className="text-blue-600 font-normal">Regístrate aquí</Link>
          </p>
          <p>
            <a href="/recuperar" className="text-blue-600 font-normal">Olvidé mi contraseña</a>
          </p>
          <p>
            <a href="/" className="text-black underline">Seguir como invitado</a>
          </p>
        </div>
      </div>
    </div>
  );
}
