"use client";
import Image from "next/image";

import { CatalogueItem } from "../Catalogue/types";
import ToggleButton from "@/components/atoms/toggleButton/toggleButton";
import useMachineDetail from "@/hooks/frontend/buyProcess/useMachineDetail";
import DateRentInput from "@/components/molecule/dateRentInput/dateRentInput";
import FilterInput from "@/components/atoms/filterInput/filterInput";
import { BookingForm } from "@/components/molecule/bookingForm/bookingForm";
import SpecsDetail from "@/components/molecule/specsDetail/specsDetail";
import PriceDetail from "@/components/atoms/priceDetail/priceDetail";
import AmazonLocationMap from "@/components/molecule/AmazonLocationService/amazonLocationMap";

interface MachineDetailProps {
  machine: CatalogueItem;
}

export default function MachineDetail({ machine }: MachineDetailProps) {
  const {
    extras,
    saveAddress,
    toggleExtra,
    toggleSaveAddress,
    router,
    error,
    loading,
    selectedLocation,
    handleLocationSelect,
    getLocationForBooking,
    validateLocation,
    clearLocation
  } = useMachineDetail(machine.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error && !error.includes('ubicación')) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="machine-detail py-20 px-4">
      <div className="container mx-auto lg:flex gap-4">
        <div className="lg:w-2/3">
          <div className="w-full h-80 relative rounded-xl overflow-hidden shadow-md">
            <Image
              src={machine.image}
              alt={machine.name}
              width={850}
              height={330}
              className="object-cover object-center aspect-[16/6] w-full h-full"
            />
          </div>

          {/* Mobile info */}
          <div className="block lg:hidden mt-6">
            <h2 className="text-2xl font-bold">{machine.name}</h2>
            {machine.specs && <SpecsDetail specsMachinary={machine.specs} />}
          </div>

          {/* Descripción */}
          <div className="mt-6 block">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Descripción:</span>{" "}
              {machine.description?.trim()
                ? machine.description
                : `La ${machine.name} combina potencia, versatilidad y eficiencia en un solo equipo. Ideal para excavación, carga y transporte en obras civiles, agrícolas y de construcción.`}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Ubicación:</span>{" "}
              {machine.location || "Ubicación no especificada"}
            </p>
          </div>

          {/* Fechas */}
          <div className="mt-6 flex flex-col gap-3.5">
            <div className="block lg:hidden mb-6">
              <PriceDetail
                price={
                    machine.pricing?.price_per_day ??
                    parseFloat(machine.price || "0")
                }
                />
            </div>
            <p className="font-semibold mb-2">
              Disponible del 5 de agosto al 23 diciembre
            </p>
            <div className="flex flex-col gap-3.5 w-full">
              <DateRentInput grid={true} />
            </div>
          </div>

          {/* Complementos */}
          <div className="mt-6 space-y-4">
            <p className="font-semibold">Complementos para tu renta</p>

            {/* Operador */}
            <div className="flex items-center justify-between border-[#B2B2B2] border-b pb-3">
                <div className="flex items-center gap-3">
                    <Image
                    src="/icons/user.svg"
                    alt="Operator"
                    width={35}
                    height={35}
                    />
                    <div>
                    <p className="text-sm font-semibold">Operador</p>
                    <p className="text-xs text-gray-500 italic">
                        Incluye un operador certificado
                    </p>
                    {machine.pricing?.no_operator_discount && (
                        <p className="text-xs italic text-green-600">
                        -{machine.pricing.no_operator_discount}% si no incluye operador
                        </p>
                    )}
                    </div>
                </div>
                <ToggleButton
                    isChecked={extras.operador}
                    onChange={() => toggleExtra("operador")}
                />
                </div>

            {/* Certificado */}
            <div className="flex items-center justify-between border-[#B2B2B2] border-b pb-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/certificade.svg"
                  alt="Certificado"
                  width={50}
                  height={50}
                />
                <div>
                  <p className="text-sm font-semibold">Certificado OnRentX</p>
                  <p className="text-xs text-gray-500 italic">
                    Estándar de calidad superior
                  </p>
                </div>
              </div>
              <ToggleButton
                isChecked={extras.certificado}
                onChange={() => toggleExtra("certificado")}
              />
            </div>

            {/* Combustible */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/fuel.svg"
                  alt="Combustible"
                  width={35}
                  height={35}
                />
                <div>
                  <p className="text-sm font-semibold">Combustible incluido</p>
                  {machine.pricing?.no_fuel_discount && (
                    <p className="text-xs italic text-green-600">
                      -{machine.pricing.no_fuel_discount}% si no incluye
                      combustible
                    </p>
                  )}
                </div>
              </div>
              <ToggleButton
                isChecked={extras.combustible}
                onChange={() => toggleExtra("combustible")}
              />
            </div>
          </div>

          {/* Mapa - ACTUALIZADO CON NUEVA FUNCIONALIDAD */}
          <div className="mt-6 block">
            <p className="font-semibold mb-2">Ubicación de tu obra</p>
            <AmazonLocationMap
              center={[-123.115898, 49.295868]}
              zoom={11}
              height="256px"
              onLocationSelect={handleLocationSelect}
              className="shadow-sm"
            />

            {/* Mostrar ubicación seleccionada si existe */}
            {selectedLocation && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      ✓ Ubicación confirmada
                    </p>
                    <p className="text-xs text-green-600">
                      {selectedLocation.address ||
                       `Lat: ${selectedLocation.lat.toFixed(6)}, Lng: ${selectedLocation.lng.toFixed(6)}`}
                    </p>
                  </div>
                  <button
                    onClick={clearLocation}
                    className="text-xs text-green-600 hover:text-green-800 underline"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            )}

            {/* Mostrar error de validación si existe */}
            {error && error.includes('ubicación') && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* Datos de reserva */}
          <div className="mt-10 py-6 space-y-6">
            <h3 className="font-semibold text-lg mb-2">Datos de reserva</h3>

            {/* Dirección - ACTUALIZADA para mostrar ubicación seleccionada */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Dirección de entrega
              </label>
              <FilterInput
                checkpersist={true}
                name=""
                inputClass="w-full border rounded-lg px-2 py-1 text-sm"
              />
              {selectedLocation && (
                <p className="text-xs text-gray-500 mt-1">
                  Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              )}
            </div>

            {/* Nombre dirección */}
            <input
              type="text"
              className="w-full border rounded-lg p-3 text-sm"
              placeholder="Nombre para esta dirección"
            />

            {/* Imagen obra */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Imagen de la obra
              </label>
              <input
                type="file"
                className="w-full border rounded-lg p-3 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Esto nos ayuda a validar el terreno y asignar maquinaria
                compatible
              </p>
            </div>

            <BookingForm
              machine={machine}
              router={router}
              getLocationForBooking={getLocationForBooking}
              validateLocation={validateLocation}
              extras={extras}
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="lg:w-1/3 hidden lg:block">
          <h1 className="text-2xl font-bold">{machine.name}</h1>
          {machine.specs && <SpecsDetail specsMachinary={machine.specs} />}
          <PriceDetail
            price={
                machine.pricing?.price_per_day ??
                parseFloat(machine.price || "0")
            }
            />
        </div>
      </div>
    </section>
  );
}
