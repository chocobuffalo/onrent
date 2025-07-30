"use client";
import { useState } from "react";

export default function FilterComponent() {
  const [price, setPrice] = useState(500); // valor inicial del slider

  return (
    <div className="w-full md:w-64 space-y-4">
      {/* Panel principal */}
      <div className="border rounded-lg p-4 space-y-4">
        {/* Input ubicación */}
        <input
          type="text"
          placeholder="San Luis Potosí, México"
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
        />

        {/* Categorías */}
        <div className="border rounded p-2">
          <p className="text-sm mb-2">Seleccione las categorías</p>
          <div className="space-y-1">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" /> Maquinaria Pesada
            </label>
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" /> Maquinaria Ligera
            </label>
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" /> Viajes de Materiales
            </label>
          </div>
        </div>

        {/* Slider de precio */}
        <div className="border rounded p-2">
          <p className="text-sm font-medium mb-2">PRECIO</p>
          <input
            type="range"
            min="0"
            max="999"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs mt-1">
            <span>0%</span>
            <span>999%</span>
          </div>

          {/* Inputs de min y max */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="min"
              className="w-1/2 border rounded px-2 py-1 text-xs focus:outline-none"
            />
            <input
              type="text"
              placeholder="max"
              className="w-1/2 border rounded px-2 py-1 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Botón buscar */}
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded text-sm font-bold">
          BUSCAR
        </button>
      </div>

      {/* Panel arrendamiento */}
      <div className="border rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium">Arrendamiento</p>
        <div className="space-y-2">
          <div className="flex items-center border rounded px-2 py-1">
            <span className="text-xs font-medium w-12">INICIO</span>
            <input
              type="date"
              className="flex-1 text-xs border-0 focus:outline-none"
            />
          </div>
          <div className="flex items-center border rounded px-2 py-1">
            <span className="text-xs font-medium w-12">FIN</span>
            <input
              type="date"
              className="flex-1 text-xs border-0 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
