// src/app/(backoffice)/operator-navigation/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useOperatorNavigation } from "@/hooks/component/useOperatorNavigation";
import { useState, useEffect } from "react";

// Definición de tipos para los resultados de búsqueda
interface SearchResult {
  Place: {
    Label: string;
    Geometry: { Point: [number, number] };
  };
}

// Importación dinámica para asegurar que se renderice solo en el cliente
const OperatorMap = dynamic(
  () => import("@/components/organism/OperatorMap").then((mod) => mod.default),
  { ssr: false }
);

const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

export default function OperatorNavigationPage() {
  const { data: session } = useSession();
  const [deviceId, setDeviceId] = useState<string>("");

  // Obtener deviceId del operador (puede venir de la sesión o ser configurado)
  useEffect(() => {
    if (session?.user) {
      // Usar el ID del usuario como deviceId o configurar según tu lógica
      const sessionWithId = session as any;
      setDeviceId(sessionWithId.user.id || `operator-${sessionWithId.user.email?.split('@')[0]}`);
    }
  }, [session]);

  const {
    currentLocation,
    destination,
    destinationAddress,
    route,
    searchQuery,
    searchResults,
    loading,
    navigationState,
    isNavigating,
    routeDistance,
    estimatedDuration,
    navigationStartTime,
    setSearchQuery,
    selectDestination,
    handleSearch,
    toggleNavigation,
    loadDestinationFromOrder,
  } = useOperatorNavigation(deviceId, session);

  // Función para formatear el tiempo transcurrido de navegación
  const formatNavigationTime = (startTime: string | null): string => {
    if (!startTime) return "0:00";
    
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Navegación del Operador</h1>
          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión como operador para acceder a esta función.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <strong>Acceso restringido</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer position="top-right" />
      
      {/* Container principal con padding responsivo */}
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        
        {/* Header con diseño moderno */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Navegación del Operador</h1>
                <p className="text-gray-600 mt-1">
                  Sistema de navegación y seguimiento GPS en tiempo real
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">Device ID:</span>
                <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-mono">
                  {deviceId}
                </code>
              </div>
              {isNavigating && navigationStartTime && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Navegando: {formatNavigationTime(navigationStartTime)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel de configuración de destino */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuración de Destino
            </h2>
          </div>
          
          <div className="p-6">
            {/* Búsqueda de destino */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar dirección de la obra
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      isNavigating ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-gray-400'
                    }`}
                    placeholder="Ej: Av. Reforma 123, CDMX..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    disabled={isNavigating}
                  />
                  <button
                    className={`absolute inset-y-0 right-0 px-4 py-2 m-1 rounded-lg font-medium transition-all duration-200 ${
                      loading || isNavigating || !searchQuery.trim()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow-md'
                    }`}
                    onClick={handleSearch}
                    disabled={loading || isNavigating || !searchQuery.trim()}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current inline" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Buscando...
                      </>
                    ) : (
                      'Buscar'
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargar desde orden
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className={`flex-1 px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      isNavigating ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-gray-400'
                    }`}
                    placeholder="ID de orden"
                    disabled={isNavigating}
                  />
                  <button
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isNavigating 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-500 text-white hover:bg-gray-600 shadow-sm hover:shadow-md'
                    }`}
                    disabled={isNavigating}
                    onClick={() => {
                      const orderId = (document.querySelector('input[placeholder="ID de orden"]') as HTMLInputElement)?.value;
                      if (orderId) {
                        loadDestinationFromOrder(orderId);
                      }
                    }}
                  >
                    Cargar
                  </button>
                </div>
              </div>
            </div>

            {/* Resultados de búsqueda */}
            {searchResults.length > 0 && !isNavigating && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Resultados de búsqueda:
                </label>
                <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {searchResults.map((result: SearchResult, index: number) => (
                      <button
                        key={index}
                        className="w-full text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
                        onClick={() => selectDestination(result)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <p className="text-gray-900 font-medium">{result.Place.Label}</p>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Destino seleccionado */}
            {destinationAddress && (
              <div className="mt-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">🎯 Destino seleccionado</p>
                        <p className="text-green-700 mt-1">{destinationAddress}</p>
                      </div>
                    </div>
                    {!isNavigating && (
                      <button
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                        onClick={() => {
                          setSearchQuery("");
                          // Reset destination logic would be added here
                        }}
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Control de Navegación
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${isNavigating ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {isNavigating ? "Navegación Activa" : "Listo para Navegar"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isNavigating ? 
                      "Compartiendo ubicación en tiempo real" : 
                      "Selecciona un destino para comenzar"
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {/* Botón principal de navegación */}
                <button
                  onClick={toggleNavigation}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    isNavigating 
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl"
                      : !currentLocation || !destination || loading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg hover:shadow-xl"
                  }`}
                  disabled={!currentLocation || !destination || loading}
                >
                  {isNavigating ? (
                    <>
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10l2 2 4-4" />
                      </svg>
                      Detener Navegación
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
                      </svg>
                      Iniciar Navegación
                    </>
                  )}
                </button>

                {/* Botón de recálculo de ruta */}
                {destination && (
                  <button
                    onClick={handleSearch}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Información de la ruta */}
            {(routeDistance || estimatedDuration) && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {routeDistance ? `${(routeDistance / 1000).toFixed(1)} km` : "Calculando..."}
                  </div>
                  <p className="text-sm text-orange-700">Distancia total</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {estimatedDuration ? 
                      `${Math.floor(estimatedDuration / 60)}m ${estimatedDuration % 60}s` : 
                      "Calculando..."
                    }
                  </div>
                  <p className="text-sm text-green-700">Tiempo estimado</p>
                </div>
              </div>
            )}

            {/* Advertencias y validaciones */}
            {!currentLocation && (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-amber-800 font-medium">GPS requerido</p>
                    <p className="text-amber-700 text-sm">Necesitas permitir el acceso a tu ubicación para usar la navegación.</p>
                  </div>
                </div>
              </div>
            )}
            
            {!destination && currentLocation && (
              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-orange-800 font-medium">Selecciona un destino</p>
                    <p className="text-orange-700 text-sm">Busca y selecciona la dirección de la obra para continuar.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mapa de navegación - Más grande y centrado */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-black px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Mapa de Navegación
            </h2>
          </div>
          
          <div className="relative" style={{ height: "700px" }}>
            <OperatorMap
              currentLocation={currentLocation}
              destination={destination}
              destinationAddress={destinationAddress}
              route={route}
              isNavigating={isNavigating}
              routeDistance={routeDistance}
              estimatedDuration={estimatedDuration}
            />
          </div>
        </div>

        {/* Panel de estado inferior - Navegación activa */}
        {isNavigating && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl shadow-2xl border border-green-300 max-w-sm mx-auto">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">📡 Navegación Activa</p>
                      <p className="text-green-100 text-xs">
                        Ubicación compartida en tiempo real
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-lg">
                      <span className="text-white font-mono text-sm">
                        {formatNavigationTime(navigationStartTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button para estados específicos */}
        {!isNavigating && destination && (
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={toggleNavigation}
              className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
              disabled={!currentLocation || loading}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
              </svg>
            </button>
          </div>
        )}

        {/* Status Cards Row para información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Estado del GPS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentLocation ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <svg className={`w-5 h-5 ${currentLocation ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Estado GPS</p>
                <p className={`text-sm ${currentLocation ? 'text-green-600' : 'text-red-600'}`}>
                  {currentLocation ? 'Conectado' : 'Sin señal'}
                </p>
              </div>
            </div>
          </div>

          {/* Estado de la conexión */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Conexión</p>
                <p className="text-sm text-green-600">Estable</p>
              </div>
            </div>
          </div>

          {/* Estado del operador */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isNavigating ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-5 h-5 ${isNavigating ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Operador</p>
                <p className={`text-sm ${isNavigating ? 'text-green-600' : 'text-gray-600'}`}>
                  {isNavigating ? 'En ruta' : 'Disponible'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos adicionales para animaciones personalizadas */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}