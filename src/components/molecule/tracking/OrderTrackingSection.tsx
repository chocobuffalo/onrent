"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { getOrderDetail } from "@/services/getOrderDetail";
import { getAvailableDevices } from "@/services/locationService";
import { OrderDetail, normalizeLocationCoords, isLocationWithAddress } from "@/types/orders";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => {
    if (typeof window !== 'undefined' && typeof mod.Marker !== "undefined") {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      });
    }
    return mod.MapContainer;
  }),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteStep {
  lat: number;
  lng: number;
}

interface OrderTrackingSectionProps {
  orderId: number;
  onBack?: () => void;
}

const OrderTrackingSection = ({ orderId, onBack }: OrderTrackingSectionProps) => {
  const { data: session } = useSession();

  const [machinePosition, setMachinePosition] = useState<LatLng | null>(null);
  const [destinationPosition, setDestinationPosition] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<RouteStep[]>([]);
  const [status, setStatus] = useState<string>("Cargando orden...");
  const [eta, setEta] = useState<string>("--");
  const [mounted, setMounted] = useState(false);
  const [orderData, setOrderData] = useState<OrderDetail | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [distance, setDistance] = useState<string>("--");

  const [isRecalculating, setIsRecalculating] = useState(false);
  const lastCalcRef = useRef<number>(0);
  
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchOrderData = useCallback(async () => {
    const token = (session as any)?.accessToken || 
                  (session as any)?.user?.accessToken || 
                  localStorage.getItem("api_access_token");

    if (!token) return;

    try {
      setLoadingOrder(true);
      const result = await getOrderDetail(orderId, token);

      if (!result.success || !result.data) {
        setStatus("Error al cargar la orden");
        return;
      }

      setOrderData(result.data);
      setStatus("Orden cargada - Buscando máquina...");

      extractDestinationFromOrder(result.data);

    } catch (error) {
      console.error("Error cargando orden:", error);
      setStatus("Error al cargar la orden");
    } finally {
      setLoadingOrder(false);
    }
  }, [orderId, session]);

  const extractDestinationFromOrder = useCallback((order: OrderDetail) => {
    const coords = normalizeLocationCoords(order.location_coords);
    if (coords) {
      setDestinationPosition(coords);
      return;
    }

    if (isLocationWithAddress(order.location)) {
      const lat = order.location.latitude ?? order.location.lat;
      const lng = order.location.longitude ?? order.location.lng;
      
      if (typeof lat === 'number' && typeof lng === 'number') {
        setDestinationPosition({ lat, lng });
        return;
      }
    }

    setDestinationPosition(null);
  }, []);

  const fetchMachineLocation = useCallback(async () => {
    if (!orderData?.machine_name) {
      setStatus("Orden sin máquina asignada");
      return;
    }

    const token = (session as any)?.accessToken || 
                  (session as any)?.user?.accessToken || 
                  localStorage.getItem("api_access_token");

    try {
      const data = await getAvailableDevices(token);
      const allDevices = data.locations || [];

      // Búsqueda flexible de la máquina (case-insensitive y por coincidencia parcial)
      const machineNameLower = orderData.machine_name.toLowerCase();
      const machine = allDevices.find((device: any) => {
        const deviceNameLower = device.name?.toLowerCase() || '';
        const deviceIdLower = device.entity_id?.toLowerCase() || '';
        
        // Coincidencia exacta o parcial en nombre o entity_id
        return deviceNameLower.includes(machineNameLower) || 
               machineNameLower.includes(deviceNameLower) ||
               deviceIdLower.includes(machineNameLower) ||
               device.name === orderData.machine_name ||
               device.entity_id === orderData.machine_name;
      });

      if (machine) {
        const lat = machine.location?.latitude ?? machine.latitude ?? 0;
        const lng = machine.location?.longitude ?? machine.longitude ?? 0;

        if (Math.abs(lat) > 0.001 || Math.abs(lng) > 0.001) {
          setMachinePosition({ lat, lng });
          setStatus("En tránsito");
        } else {
          setStatus("Máquina sin señal GPS");
          setMachinePosition(null);
        }
      } else {
        setStatus("Máquina no encontrada en tracking");
        setMachinePosition(null);
      }
    } catch (error) {
      console.error("Error obteniendo ubicación de máquina:", error);
      setStatus("Error al obtener ubicación");
      setMachinePosition(null);
    }
  }, [orderData, session]);

  const calculateRoute = useCallback(async () => {
    if (!machinePosition || !destinationPosition) {
      setRoute([]);
      setDistance("--");
      setEta("--");
      return;
    }

    const token = (session as any)?.accessToken || 
                  (session as any)?.user?.accessToken || 
                  localStorage.getItem("api_access_token");

    try {
      setIsRecalculating(true);
      const response = await fetch("/api/get-map/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          origin: { lat: machinePosition.lat, lng: machinePosition.lng },
          destination: { lat: destinationPosition.lat, lng: destinationPosition.lng },
        }),
      });

      const data = await response.json();

      if (response.ok && data.Legs && data.Legs.length > 0) {
        const leg = data.Legs[0];
        
        const newRoute: RouteStep[] = leg.Geometry.LineString.map((point: [number, number]) => ({
          lng: point[0],
          lat: point[1],
        }));
        setRoute(newRoute);

        const distanceKm = (leg.Distance / 1000).toFixed(1);
        setDistance(`${distanceKm} km`);

        const durationMinutes = Math.round(leg.DurationSeconds / 60);
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        setEta(hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`);

      } else {
        console.warn("⚠️ No se pudo recalcular ruta, manteniendo la anterior");
      }
    } catch (error) {
      console.error("Error calculando ruta:", error);
    } finally{
      setIsRecalculating(false);
    }
  }, [machinePosition, destinationPosition, session]);

  useEffect(() => {
    if (machinePosition && destinationPosition) {
      const now = Date.now();
      if (now - lastCalcRef.current > 60000) { // throttle: 60s
        calculateRoute();
        lastCalcRef.current = now;
      }
    }
  }, [machinePosition, destinationPosition, calculateRoute]);

  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  useEffect(() => {
    if (orderData && !loadingOrder) {
      fetchMachineLocation();
      
      trackingIntervalRef.current = setInterval(fetchMachineLocation, 15000);
      
      return () => {
        if (trackingIntervalRef.current) {
          clearInterval(trackingIntervalRef.current);
        }
      };
    }
  }, [orderData, loadingOrder, fetchMachineLocation]);

  if (loadingOrder) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la orden...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Orden No Encontrada</h3>
          <p className="text-gray-600 mb-4">No se pudo cargar la información de esta orden.</p>
          {onBack && (
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Volver
            </button>
          )}
        </div>
      </div>
    );
  }

  const mapCenter = machinePosition || destinationPosition || { lat: 19.4326, lng: -99.1332 };

  return (
    <div className="space-y-4">
      {/* Información de la orden */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            Orden #{orderData.order_id}
          </h2>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Volver a lista
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Máquina</p>
            <p className="font-semibold text-gray-900">
              {orderData.machine_name || "Sin asignar"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Proyecto</p>
            <p className="font-semibold text-gray-900">
              {orderData.project || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estado</p>
            <p className="font-semibold text-gray-900 capitalize">
              {orderData.state}
            </p>
          </div>
        </div>
      </div>

      {/* Panel de estado */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-blue-600">Estado</p>
            <p className="font-semibold text-blue-900">{status}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600">Distancia</p>
            <p className="font-semibold text-blue-900">{distance}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600">Tiempo estimado</p>
            <p className="font-semibold text-blue-900">{eta}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600">GPS</p>
            <p className="font-semibold text-blue-900">
              {machinePosition ? "Activo" : "Sin señal"}
            </p>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-lg shadow overflow-hidden" style={{ minHeight: "600px", height: "70vh" }}>
        {mounted && mapCenter ? (
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={13}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            />
            {machinePosition && (
              <Marker position={[machinePosition.lat, machinePosition.lng]}>
                <Popup>
                  <strong>Ubicación Actual de la Máquina</strong><br />
                  {orderData.machine_name}
                </Popup>
              </Marker>
            )}
            {destinationPosition && (
              <Marker position={[destinationPosition.lat, destinationPosition.lng]}>
                <Popup>
                  <strong>Destino de la Obra</strong><br />
                  {orderData.project || "Destino"}
                </Popup>
              </Marker>
            )}
            {route.length > 0 && (
              <Polyline
                positions={route.map((step) => [step.lat, step.lng])}
                color="red"
                weight={3}
              />
            )}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 rounded">
            Cargando mapa de seguimiento...
          </div>
        )}

        {/* Aviso discreto de recálculo */}
        {isRecalculating && (
          <div className="absolute bottom-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded shadow">
            Recalculando ruta…
          </div>
        )}  
      </div>

      {/* Alertas */}
      {!machinePosition && orderData.machine_name && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ La máquina aún no está enviando señal GPS. El seguimiento se activará cuando la máquina esté en movimiento.
          </p>
        </div>
      )}

      {!orderData.machine_name && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700">
            ℹ️ Esta orden aún no tiene una máquina asignada. El seguimiento estará disponible una vez que se asigne el equipo.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingSection;