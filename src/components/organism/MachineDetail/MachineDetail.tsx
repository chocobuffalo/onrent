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
  } = useMachineDetail(machine.id);

  return (
    <section className="machine-detail py-20 px-4">
      <div className="container mx-auto lg:flex  gap-4 ">
        {/* Columna izquierda */}
        <div className="lg:w-2/3">
          {/* Imagen */}
          <div className="w-full h-80 relative rounded-xl overflow-hidden shadow-md ">
            <Image
              src={machine.image}
              alt={machine.name}
              width={850}
              height={330}
              className="object-cover object-center aspect-[16/6] w-full h-full"
            />
          </div>
          {/*mobile info*/}
          <div className="block lg:hidden mt-6">
             <h2 className="text-2xl font-bold">{machine.name}</h2>
                 {/* Especificaciones */}
          {machine.specs && <SpecsDetail specsMachinary={machine.specs} />}
          </div>

          {/* Descripción */}
          <div className="mt-6 block">
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
          <div className="mt-6 flex flex-col gap-3.5">
            <div className="block lg:hidden mb-6">
               <PriceDetail price={parseFloat(machine.price)} />
            </div>
            <p className="font-semibold mb-2">Disponible del 5 de agosto al 23 diciembre</p>
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
                <Image src="/icons/user.svg" alt="Operator" width={35} height={35} />
                <div>
                  <p className="text-sm font-semibold">Operador</p>
                  <p className="text-xs text-gray-500 italic">Incluye un operador certificado</p>
                  {/* <p className="text-xs italic text-green-600">+18USD / Día</p> */}
                </div>
              </div>
              <ToggleButton isChecked={extras.operador} onChange={() => toggleExtra("operador")} />
            </div>

            {/* Certificado */}
            <div className="flex items-center justify-between border-[#B2B2B2] border-b pb-3">
              <div className="flex items-center gap-3">
                <Image src="/icons/certificade.svg" alt="Certificado" width={50} height={50} />
                <div>
                  <p className="text-sm font-semibold">Certificado OnRentX</p>
                  <p className="text-xs text-gray-500 italic">Estándar de calidad superior</p>
                </div>
              </div>
             <ToggleButton isChecked={extras.certificado} onChange={() => toggleExtra("certificado")} />

            </div>

            {/* Combustible */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/icons/fuel.svg" alt="Combustible" width={35} height={35} />
                <p className="text-sm font-semibold">Combustible incluido</p>
              </div>
              <ToggleButton isChecked={extras.combustible} onChange={() => toggleExtra("combustible")} />
            </div>
          </div>

          {/* Mapa */}
          <div className="mt-6 block">
            <p className="font-semibold mb-2">Ubicación de tu obra</p>
            <div className="w-full h-64 rounded-lg overflow-hidden border">
              <iframe
                className="w-full h-full"
                src="https://maps.google.com/maps?q=San%20Luis%20Potosi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              ></iframe>
            </div>
          </div>

          {/* Datos de reserva */}
          <div className="mt-10 py-6 space-y-6 ">
            <h3 className="font-semibold text-lg mb-2">Datos de reserva</h3>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium mb-1">Dirección de entrega</label>
              <FilterInput checkpersist={true} name=""  inputClass="w-full border rounded-lg px-2 py-1 text-sm" />
            </div>

            {/* Switch guardar dirección */}
            {/* <div className="flex items-center justify-between">
              <span className="text-sm">Guardar esta dirección</span>
               <ToggleButton isChecked={saveAddress} onChange={toggleSaveAddress} />
            </div> */}

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
            <BookingForm machine={machine} router={router} />

          </div>
        </div>

        {/* Columna derecha */}
        <div className="lg:w-1/3 hidden lg:block">
          <h1 className="text-2xl font-bold">{machine.name}</h1>

          {/* Estrellas y usuario */}
          {/* 
          //no aplicable 
          {<CarUserProvider/>} */}
          

          {/* Especificaciones */}
          {machine.specs && <SpecsDetail specsMachinary={machine.specs} />}
          {/* Precio */}
          <PriceDetail price={parseFloat(machine.price)} />
        </div>
      </div>
    
    </section>
  );
}
