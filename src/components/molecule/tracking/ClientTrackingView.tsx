"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getOrdersList } from "@/services/getOrders";
import { OrderResponse } from "@/types/orders";
import OrderTrackingSection from "@/components/molecule/tracking/OrderTrackingSection";

const ClientTrackingView = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const token = (session as any)?.accessToken || 
                  (session as any)?.user?.accessToken || 
                  localStorage.getItem("api_access_token");

    if (!token) {
      setError("No se encontró token de sesión");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await getOrdersList(token);

      if (!result.success || !result.data) {
        setError(result.message || "Error al cargar órdenes");
        setOrders([]);
        setFilteredOrders([]);
        return;
      }

      const allOrders = result.data;
      
      // Filtrar solo órdenes confirmadas/activas con máquina asignada
      const trackableOrders = allOrders.filter(order => {
        const stateLower = order.state.toLowerCase();
        const isConfirmedOrActive = 
          stateLower.includes('confirmad') || // Acepta "confirmada", "confirmado", etc.
          stateLower.includes('activa') || 
          stateLower.includes('activo') ||
          stateLower.includes('en_curso') ||
          stateLower.includes('en curso');
        
        const hasMachine = order.machine_name && order.machine_name.trim() !== '';
        
        return isConfirmedOrActive && hasMachine;
      });

      setOrders(allOrders);
      setFilteredOrders(trackableOrders);

      // Auto-seleccionar primera orden si existe
      if (trackableOrders.length > 0 && !selectedOrderId) {
        setSelectedOrderId(trackableOrders[0].order_id);
      }

      setError(null);
    } catch (err) {
      console.error("Error cargando órdenes:", err);
      setError("Error al cargar órdenes");
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [session, selectedOrderId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOrderChange = (orderId: string) => {
    const id = parseInt(orderId);
    setSelectedOrderId(id > 0 ? id : null);
  };

  const handleBackToList = () => {
    setSelectedOrderId(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cargando tus órdenes...
          </h3>
          <p className="text-gray-600">
            Buscando órdenes activas con seguimiento disponible
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar órdenes</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No hay órdenes disponibles para seguimiento
          </h2>
          <p className="text-gray-600 mb-4">
            {orders.length > 0 
              ? "Tus órdenes aún no tienen máquinas asignadas o no están en estado activo."
              : "No tienes órdenes registradas en este momento."}
          </p>
          <button 
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Seguimiento de mis Órdenes
            </h1>
            <p className="text-gray-600">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'orden activa' : 'órdenes activas'} con seguimiento disponible
            </p>
          </div>
          
          {/* Selector de órdenes */}
          <div className="lg:w-96">
            <label htmlFor="orderSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona una orden para rastrear:
            </label>
            <select
              id="orderSelect"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedOrderId || ""}
              onChange={(e) => handleOrderChange(e.target.value)}
            >
              <option value="">Seleccionar orden...</option>
              {filteredOrders.map(order => (
                <option key={order.order_id} value={order.order_id}>
                  Orden #{order.order_id} - {order.machine_name} - {order.project || order.name}
                </option>
              ))}
            </select>
          </div>

          {/* Indicador de orden seleccionada */}
          {selectedOrderId && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Orden activa - Seguimiento en tiempo real
                  </p>
                  <p className="text-sm text-green-600">
                    Actualización cada 15 segundos
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-2 sm:p-4 overflow-auto">
        {selectedOrderId ? (
          <OrderTrackingSection 
            orderId={selectedOrderId} 
            onBack={handleBackToList}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm border">
            <div className="text-center px-4">
              <div className="text-4xl sm:text-6xl mb-4">🗺️</div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Selecciona una orden para ver su seguimiento
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'orden disponible' : 'órdenes disponibles'} para rastrear
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer con estadísticas */}
      <div className="bg-white border-t p-2 sm:p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-semibold text-xs sm:text-sm">Total Órdenes</div>
            <div className="text-base sm:text-lg font-bold text-blue-800">{orders.length}</div>
          </div>
          
          <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
            <div className="text-green-600 font-semibold text-xs sm:text-sm">Con Seguimiento</div>
            <div className="text-base sm:text-lg font-bold text-green-800">{filteredOrders.length}</div>
          </div>
          
          <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg">
            <div className="text-orange-600 font-semibold text-xs sm:text-sm">Orden Actual</div>
            <div className="text-xs sm:text-sm font-bold text-orange-800 truncate">
              {selectedOrderId ? `#${selectedOrderId}` : 'Ninguna'}
            </div>
          </div>

          <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg">
            <div className="text-purple-600 font-semibold text-xs sm:text-sm">Estado</div>
            <div className="text-xs sm:text-sm font-bold text-purple-800">
              {selectedOrderId ? 'Rastreando' : 'En espera'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTrackingView;