// src/app/(backoffice)/operator-navigation/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useOperatorNavigation } from "@/hooks/component/useOperatorNavigation";

// Definición de tipos para los resultados de búsqueda
interface SearchResult {
  Place: {
    Label: string;
    Geometry: { Point: [number, number] };
  };
}

// Importación dinámica para asegurar que el mapa se renderice solo en el cliente
const OperatorMap = dynamic(
  () => import("@/components/organism/OperatorMap").then((mod) => mod.default),
  { ssr: false }
);

// Importación dinámica para el ToastContainer
const ToastContainer = dynamic(
  () =>
    import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

export default function OperatorNavigationPage() {
  const { data: session } = useSession();

  const {
    currentLocation,
    destination,
    destinationAddress,
    route,
    isNavigating,
    searchQuery,
    searchResults,
    loading,
    setSearchQuery,
    selectDestination,
    handleSearch,
    toggleNavigation,
  } = useOperatorNavigation("id-del-dispositivo", session);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Navegación del Operador</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Destino</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="border p-2 flex-grow"
            placeholder="Buscar dirección de la obra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            disabled={isNavigating}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading || isNavigating}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
        {searchResults.length > 0 && (
          <ul className="border rounded mt-2 max-h-40 overflow-y-auto bg-white">
            {searchResults.map((result: SearchResult, index: number) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => selectDestination(result)}
              >
                {result.Place.Label}
              </li>
            ))}
          </ul>
        )}
        {destinationAddress && (
          <p className="mt-2 font-semibold">
            Destino Seleccionado: {destinationAddress}
          </p>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={toggleNavigation}
          className={`px-6 py-3 rounded text-white font-bold ${
            isNavigating ? "bg-red-600" : "bg-green-600"
          } disabled:opacity-50`}
          disabled={!currentLocation || !destination || loading}
        >
          {isNavigating ? "Detener Navegación" : "Iniciar Navegación"}
        </button>
        {isNavigating && (
          <button
            onClick={handleSearch}
            className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            Recalcular Ruta
          </button>
        )}
      </div>

      <OperatorMap
        currentLocation={currentLocation}
        destination={destination}
        destinationAddress={destinationAddress}
        route={route}
        isNavigating={isNavigating}
      />
    </div>
  );
}