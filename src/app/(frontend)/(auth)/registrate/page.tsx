'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object({
  tipoUsuario: Yup.string().required('Selecciona un tipo de usuario'),
  emailOrPhone: Yup.string().required('Este campo es obligatorio'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

export default function Registro() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    console.log('Datos enviados:', data);
    alert('Registro exitoso (simulado)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-xl px-16 py-16">
        <h1 className="text-center text-black text-lg font-semibold mb-10">Registrarte</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[12px] font-light text-gray-700">
          {/* Tipo de usuario */}
          <div>
            <label className="block mb-1">Tipo de usuario</label>
            <select
              {...register('tipoUsuario')}
              className="w-full rounded-md px-4 py-4 bg-[#E9E9E9] appearance-none focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>Selecciona el tipo de usuario</option>
              <option value="cliente">Cliente</option>
              <option value="proveedor">Proveedor</option>
            </select>
            {errors.tipoUsuario && <p className="text-red-500 mt-1">{errors.tipoUsuario.message}</p>}
          </div>

          {/* Correo / Teléfono */}
          <div>
            <label className="block mb-1">Correo electrónico o teléfono <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register('emailOrPhone')}
              placeholder="Introduce tu correo electrónico o teléfono"
              className="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
            />
            {errors.emailOrPhone && <p className="text-red-500 mt-1">{errors.emailOrPhone.message}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block mb-1">Contraseña <span className="text-red-500">*</span></label>
            <input
              type="password"
              {...register('password')}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
            />
            {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block mb-1">Confirmar Contraseña <span className="text-red-500">*</span></label>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="Repite tu contraseña"
              className="w-full rounded-md px-4 py-4 bg-[#E9E9E9] focus:outline-none"
            />
            {errors.confirmPassword && <p className="text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Botón Crear cuenta */}
          <button
            type="submit"
            className={`w-full py-4 rounded-md font-semibold text-white text-[12px] tracking-wide transition-colors ${
              isValid
                ? 'bg-[#1C1B3A] hover:bg-[#0f0f26]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!isValid}
          >
            Crear cuenta
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-[12px] text-gray-400 font-light">o</div>

        {/* Google Login */}
        <button  className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white border px-6 py-4 rounded-md shadow-sm hover:shadow-md transition text-[12px] font-light">
          <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
