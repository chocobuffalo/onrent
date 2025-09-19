"use client";

import { useEffect, useState } from "react";
import TrackingMap, { DeviceLocation } from "@/components/molecule/TrackingMap/TrackingMap";
import { useOrderLocation } from "@/hooks/backend/useOrderLocation";
import { useActiveOperators } from "@/hooks/backend/useActiveOperators";
import { useAssignedMachine } from "@/hooks/backend/useAssignedMachine";

// Extiende DeviceLocation para incluir más datos de la máquina
export interface FleetMapLocation extends DeviceLocation {
  name?: string;
  machine_category?: string;
  status?: string;
}
import { getMachineryList } from "@/services/getMachinery.adapter";
import { useUIAppSelector } from "@/libs/redux/hooks";

/**
 * Página que muestra el mapa de tracking para:
 * - Cliente: ver ubicación de su renta
 * - Proveedor: ver ubicación de su flota
 * - Operador: navegar hacia destino
 */



export default function TrackingPage() {
  // Obtener orderId automáticamente desde Redux (carrito/orden activa)
  const orderId = useUIAppSelector((state) => state.order.order_id);
  // Token y rol de sesión desde Redux
  const token = useUIAppSelector((state) => state.auth.profile.token);
  const role = useUIAppSelector((state) => state.auth.profile.role);
  const partnerId = useUIAppSelector((state) => state.auth.profile.odoo_partner_id);

  // Debug: mostrar el rol actual
  console.log('Rol del usuario:', role);

  // Estado para la flota de maquinaria
  const [fleet, setFleet] = useState<FleetMapLocation[]>([]);

  // Hook para operadores activos (proveedor)
  const { operators: activeOperators } = useActiveOperators(token);

  // Hook para ubicación en tiempo real de la orden (cliente)
  const { location: orderLocation, loading: loadingOrderLocation } = useOrderLocation(orderId ?? "");

  // Estado para el destino (puedes ajustarlo según tu lógica de negocio)
  const [destination] = useState<{ lat: number; lng: number }>({
    lat: 19.427,
    lng: -99.167,
  });

  // Estado para la posición del operador (tracking en tiempo real)
  const [operatorPosition, setOperatorPosition] = useState<DeviceLocation | null>(null);

  // Hook para la máquina asignada al operador
  const operatorId = partnerId || "";
  const { machine: assignedMachine } = useAssignedMachine(operatorId, token);

  // Efecto: tracking en tiempo real del operador (solo si es operador)
  useEffect(() => {
    if (role !== "operador" && role !== "operator") return;
    let watchId: number | null = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setOperatorPosition({
            id: "operator",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Error obteniendo geolocalización:", err);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    }
    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [role]);

  // Polling para obtener la flota en tiempo real
  useEffect(() => {
    if (!token) return;
    let intervalId: NodeJS.Timeout;

    const fetchFleet = async () => {
      const result = await getMachineryList(token);
      if (result.success && Array.isArray(result.data)) {
        // Filtrar solo máquinas con coordenadas válidas
        const mappedFleet = result.data
          .filter(m => typeof m.gps_lat === 'number' && typeof m.gps_lng === 'number')
          .map(m => ({
            id: m.id.toString(),
            lat: m.gps_lat!,
            lng: m.gps_lng!,
            name: m.name,
            machine_category: m.machine_category,
            status: m.status,
          }));
        setFleet(mappedFleet);
      }
    };

    fetchFleet(); // Primera carga
    intervalId = setInterval(fetchFleet, 10000); // Cada 10 segundos

    return () => clearInterval(intervalId);
  }, [token]);

  // Determinar qué datos mostrar según el rol
  let fleetToShow: FleetMapLocation[] = [];
  let operatorToShow: DeviceLocation | null = null;
  let destinationToShow = destination;

  // LOGS para depuración
  console.log("FLEET (maquinaria):", fleet);
  console.log("OPERATORS (activos):", activeOperators);
  console.log("ORDER LOCATION (cliente):", orderLocation);
  console.log("ASSIGNED MACHINE (operador):", assignedMachine);

  if (role === "proveedor" || role === "provider") {
    // Proveedor: muestra toda la flota y operadores activos
    // Combina la flota y los operadores activos como marcadores
    fleetToShow = [
      ...fleet,
      ...activeOperators.map(op => ({
        id: `operator-${op.id}`,
        lat: op.lat,
        lng: op.lng,
        name: op.name || "Operador activo",
        machine_category: "operador",
        status: op.status || "activo"
      }))
    ];
  } else if (role === "operador" || role === "operator") {
    // Operador: muestra su posición y la máquina asignada
    operatorToShow = operatorPosition;
    fleetToShow = [];
    if (assignedMachine) {
      fleetToShow.push({
        ...assignedMachine,
        name: assignedMachine.name || "Mi máquina asignada",
        machine_category: assignedMachine.machine_category || "asignada",
        status: assignedMachine.status || "asignada"
      });
    }
  } else if (role === "cliente" || role === "cliente_proveedor" || role === "client") {
    // Cliente: solo la ubicación de su renta (orderLocation)
    if (orderLocation && orderLocation.lat && orderLocation.lng) {
      fleetToShow = [{
        id: "order-location",
        lat: orderLocation.lat,
        lng: orderLocation.lng,
        name: orderLocation.name || "Mi máquina",
        machine_category: orderLocation.machine_category || "renta",
        status: orderLocation.status || "en_renta"
      }];
    } else {
      fleetToShow = [];
    }
  }

  return (
    <div className="w-full h-[600px]">
      <TrackingMap
        operatorPosition={operatorToShow}
        initialDestination={destinationToShow}
        fleet={fleetToShow}
        // Forzar actualización de la ruta cuando operador y destino estén listos
        key={role === "operador" || role === "operator" ? `${operatorToShow?.lat},${operatorToShow?.lng},${destinationToShow.lat},${destinationToShow.lng}` : undefined}
      />
    </div>
  );
}
