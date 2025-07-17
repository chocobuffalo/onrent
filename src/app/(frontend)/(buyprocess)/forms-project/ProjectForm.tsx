"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const MapaCliente = dynamic(() => import("./MapaClienteGoogle"), { ssr: false });


export default function ProjectForm() {
  const [formData, setFormData] = useState({
    responsable: "",
    telefono: "",
    proyecto: "",
    ubicacion: null as [number, number] | null,
    fechaInicio: "",
    fechaFin: "",
    tipoTrabajo: "",
    tipoTrabajoOtro: "",
    tipoMaterial: "",
    seguridad: "",
    descripcionSeguridad: "",
    imagenSeguridad: null as File | null,
    acceso: "",
    accesoArchivo: null as File | null,
    requisitosEspeciales: "",
  });

  useEffect(() => {
    if (formData.fechaInicio && formData.fechaFin) {
      console.log("🔍 Duración desde", formData.fechaInicio, "hasta", formData.fechaFin);
    }
  }, [formData.fechaInicio, formData.fechaFin]);

  const handleFile = (field: "imagenSeguridad" | "accesoArchivo", file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-10">Formulario del Proyecto</h1>

      <FormSection title="1. Datos básicos">
        <Input label="Nombre del responsable" onChange={(e) => setFormData({ ...formData, responsable: e.target.value })} />
        <Input label="Teléfono del responsable" type="tel" onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
        <Input label="Nombre del proyecto" onChange={(e) => setFormData({ ...formData, proyecto: e.target.value })} />

        <Input
          label="Fecha estimada de inicio"
          type="date"
          onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
        />
        <Input
          label="Fecha estimada de fin"
          type="date"
          onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
        />

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Ubicación de la obra (seleccione en el mapa)
          </label>
          <MapaCliente
            ubicacion={formData.ubicacion}
            setUbicacion={(coords) => setFormData({ ...formData, ubicacion: coords })}
          />
          {formData.ubicacion && (
            <p className="text-xs text-gray-500 mt-2">
              Coordenadas: {formData.ubicacion[0]}, {formData.ubicacion[1]}
            </p>
          )}
        </div>
      </FormSection>

      <FormSection title="2. Condiciones del sitio">
        <Select
          label="Tipo de obra a realizar"
          options={["Edificación", "Obra civil", "Camino", "Desarrollo Urbano", "Otro"]}
          onChange={(e) => setFormData({ ...formData, tipoTrabajo: e.target.value })}
        />

        {formData.tipoTrabajo === "Otro" && (
          <Input
            label="Especificar otro tipo de obra"
            onChange={(e) => setFormData({ ...formData, tipoTrabajoOtro: e.target.value })}
          />
        )}

        <Input
          label="Tipo de material del terreno"
          placeholder="Ej. Suave, Rocoso, etc."
          onChange={(e) => setFormData({ ...formData, tipoMaterial: e.target.value })}
        />
      </FormSection>

      <FormSection title="3. Seguridad y acceso">
        <Select
          label="¿Hay medidas de seguridad en el sitio?"
          options={["Sí", "No", "Otro"]}
          onChange={(e) => setFormData({ ...formData, seguridad: e.target.value })}
        />
        <Input
          label="Descripción de seguridad"
          onChange={(e) => setFormData({ ...formData, descripcionSeguridad: e.target.value })}
        />
        <FileInput
          label="Imagen del lugar del trabajo"
          onChange={(file) => handleFile("imagenSeguridad", file)}
        />
        <Input
          label="Acceso a la obra"
          onChange={(e) => setFormData({ ...formData, acceso: e.target.value })}
        />
        <FileInput
          label="Adjuntar imagen o documento del acceso"
          onChange={(file) => handleFile("accesoArchivo", file)}
        />
      </FormSection>

      <FormSection title="4. Requisitos adicionales">
        <Input
          label="Requisitos especiales"
          placeholder="Ej. terreno con pendiente, entrada limitada, etc."
          onChange={(e) => setFormData({ ...formData, requisitosEspeciales: e.target.value })}
        />
      </FormSection>

      <div className="flex justify-end mt-6">
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2 rounded-lg shadow transition-all">
          Guardar como borrador
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  placeholder = "",
  type = "text",
  onChange,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder || label}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm transition"
      />
    </div>
  );
}

function Select({
  label,
  options,
  onChange,
}: {
  label: string;
  options: string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 block mb-2">{label}</label>
      <select
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm"
      >
        <option value="">Seleccionar</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({
  label,
  onChange,
}: {
  label: string;
  onChange?: (file: File | null) => void;
}) {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 block mb-2">{label}</label>
      <input
        type="file"
        title="Elegir imagen"
        className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md
          file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
          file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
        onChange={(e) => onChange?.(e.target.files?.[0] || null)}
      />
    </div>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </section>
  );
}
