"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation"; // <-- Importar router
import { CatalogueItem } from "../Catalogue/types";

interface MachineDetailProps {
  machine: CatalogueItem;
}

export default function MachineDetail({ machine }: MachineDetailProps) {
  const [extras, setExtras] = useState({
    operador: true,
    certificado: true,
    combustible: true,
  });

  const router = useRouter(); // <-- Inicializar router

  const toggleExtra = (key: keyof typeof extras) => {
    setExtras((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda */}
        <div className="lg:col-span-2">
          {/* Imagen */}
          <div className="w-full h-80 relative rounded-xl overflow-hidden shadow-md">
            <Image
              src={machine.image}
              alt={machine.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Descripción */}
          <div className="mt-4">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Descripción:</span> La {machine.name} combina potencia,
              versatilidad y eficiencia en un solo equipo. Ideal para excavación, carga y transporte
              en obras civiles, agrícolas y de construcción.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Ubicación:</span> {machine.location}
            </p>
          </div>

          {/* Fechas */}
          <div className="mt-6">
            <p className="font-semibold mb-2">Disponible del 5 de agosto al 23 diciembre</p>
            <div className="flex gap-3">
              <input
                type="date"
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <input
                type="date"
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm">
                Reservar
              </button>
            </div>
          </div>

          {/* Complementos */}
          <div className="mt-6 space-y-4">
            <p className="font-semibold">Complementos para tu renta</p>

            {/* Operador */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <Image src="/icons/user.svg" alt="Operator" width={35} height={35} />
                <div>
                  <p className="text-sm font-semibold">Operador</p>
                  <p className="text-xs text-gray-500 italic text-green-600">+18USD / Día</p>
                </div>
              </div>
              <button
                onClick={() => toggleExtra("operador")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  extras.operador ? "bg-orange-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    extras.operador ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Certificado */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <Image src="/icons/certificado.svg" alt="Certificado" width={35} height={35} />
                <div>
                  <p className="text-sm font-semibold">Certificado OnRentX</p>
                  <p className="text-xs text-gray-500 italic">Estándar de calidad superior</p>
                </div>
              </div>
              <button
                onClick={() => toggleExtra("certificado")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  extras.certificado ? "bg-orange-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    extras.certificado ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Combustible */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/icons/fuel.svg" alt="Combustible" width={35} height={35} />
                <p className="text-sm font-semibold">Combustible incluido</p>
              </div>
              <button
                onClick={() => toggleExtra("combustible")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  extras.combustible ? "bg-orange-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    extras.combustible ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mapa */}
          <div className="mt-6">
            <p className="font-semibold mb-2">Ubicación de tu obra</p>
            <div className="w-full h-64 rounded-lg overflow-hidden border">
              <iframe
                className="w-full h-full"
                src="https://maps.google.com/maps?q=San%20Luis%20Potosi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              ></iframe>
            </div>
          </div>

          {/* Datos de reserva */}
          <div className="mt-10 border rounded-lg p-6 space-y-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Datos de reserva</h3>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium mb-1">Dirección de entrega</label>
              <input
                type="text"
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Ej: San Pedro Garza García 967, Nuevo León, México"
              />
            </div>

            {/* Switch guardar dirección */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Guardar esta dirección</span>
              <button className="relative w-12 h-6 rounded-full bg-orange-500">
                <span className="absolute left-6 top-0.5 w-5 h-5 bg-white rounded-full shadow"></span>
              </button>
            </div>

            {/* Nombre dirección */}
            <input
              type="text"
              className="w-full border rounded-lg p-3 text-sm"
              placeholder="Nombre para esta dirección"
            />

            {/* Imagen obra */}
            <div>
              <label className="block text-sm font-medium mb-1">Imagen de la obra</label>
              <input type="file" className="w-full border rounded-lg p-3 text-sm" />
              <p className="text-xs text-gray-400 mt-1">
                Esto nos ayuda a validar el terreno y asignar maquinaria compatible
              </p>
            </div>

            {/* Detalles precio */}
            <div className="border rounded-lg p-5 bg-white space-y-3">
              <h4 className="font-medium text-sm mb-2">Detalles del precio</h4>

              <div className="flex items-center space-x-2 mb-2">
                <button className="w-6 h-6 flex items-center justify-center border rounded-md">-</button>
                <span className="px-3 text-sm border rounded-md">1</span>
                <button className="w-6 h-6 flex items-center justify-center border rounded-md">+</button>
                <span className="text-sm font-semibold ml-2">{machine.name}</span>
              </div>

              <p className="text-red-500 text-sm">
                Precio normal: <span className="font-bold">800$/USD</span>
              </p>
              <p className="text-sm text-gray-600">
                Descuento: <span className="font-bold">15%</span>
              </p>
              <p className="text-green-600 font-bold text-base">Precio con descuento: 680$/USD</p>
              <p className="text-sm text-gray-600">Fechas: 1 Sep - 29 Sep</p>

              {/* Cambiar modal por navegación */}
               <button
                  onClick={() => router.push(`/catalogo/${machine.machinetype}/${machine.id}/reserva`)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold mt-4"
                >
                  RESERVAR
                </button>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{machine.name}</h1>

          {/* Estrellas y usuario */}
          <div className="flex items-center space-x-2">
            <Image src="/icons/user.svg" alt="User" width={24} height={24} />
            <span className="font-medium text-sm">Nameuser Nameuser</span>
            <span className="text-blue-500">✔</span>
          </div>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-400 text-lg">★</span>
            ))}
            <span className="text-sm text-gray-600 ml-2">(4.5)</span>
          </div>

          {/* Precio */}
          <div className="p-3 border rounded-lg bg-green-50">
            <p className="text-green-700 font-bold text-lg">{machine.price} USD/Día</p>
            <p className="text-xs text-gray-600">Cancelación sin costo en cualquier momento</p>
          </div>

          {/* Especificaciones */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 border rounded-lg text-center text-sm"><p>Peso: 1.5 Toneladas</p></div>
            <div className="p-3 border rounded-lg text-center text-sm"><p>Motor: 4 HP</p></div>
            <div className="p-3 border rounded-lg text-center text-sm"><p>Alto: 3 Metros</p></div>
            <div className="p-3 border rounded-lg text-center text-sm"><p>Combustible: Diesel</p></div>
            <div className="p-3 border rounded-lg text-center text-sm"><p>Ancho: 2 Metros</p></div>
            <div className="p-3 border rounded-lg text-center text-sm"><p>Asientos: 2</p></div>
          </div>
        </div>
      </div>
    
    </>
  );
}
