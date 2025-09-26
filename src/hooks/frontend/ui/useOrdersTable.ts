"use client";

import { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useOrders from "@/hooks/backend/useOrders";
import { OrderResponse, OrderDetail } from "@/types/orders";
import { TableColumn, ActionButton } from "../../../types/machinary";

export default function useOrdersTable() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

  const {
    orders,
    isLoading,
    error,
    getOrderDetailById,
  } = useOrders();

  const filteredOrders = useMemo(() => {
    if (!searchValue) return orders;

    return orders.filter((order) => {
      const searchLower = searchValue.toLowerCase();
      return (
        order.order_id?.toString().includes(searchLower) ||
        order.machine_name?.toLowerCase().includes(searchLower) ||
        order.state?.toLowerCase().includes(searchLower)
      );
    });
  }, [orders, searchValue]);

  // Función para manejar el seguimiento GPS
  const handleTrackOrder = (order: OrderResponse) => {
    console.log("🗺️ Iniciando seguimiento para orden:", order.order_id);
    console.log("🔍 DEBUG - Estructura completa de order:", order);
    console.log("🔍 DEBUG - Propiedades de order:", Object.keys(order));
    
    // Múltiples opciones para obtener el deviceId
    let deviceId = null;
    
    // Opción 1: rental_items (si existe)
    if ((order as any)?.rental_items && (order as any).rental_items.length > 0) {
      deviceId = (order as any).rental_items[0]?.machine_id;
      console.log("✅ DeviceId desde rental_items:", deviceId);
    }
    // Opción 2: machine_id directo (si existe)
    else if ((order as any)?.machine_id) {
      deviceId = (order as any).machine_id;
      console.log("✅ DeviceId desde machine_id:", deviceId);
    }
    // Opción 3: usar order_id como fallback para testing
    else {
      deviceId = `ORDER-${order.order_id}`;
      console.log("⚠️ Usando order_id como deviceId fallback:", deviceId);
    }

    if (deviceId) {
      console.log("🚀 Redirigiendo al seguimiento con deviceId:", deviceId);
      router.push(`/dashboard/tracking?deviceId=${deviceId}`);
    } else {
      console.error("❌ No se pudo obtener ningún deviceId");
      toast.error('No se pudo obtener el ID para seguimiento.');
    }
  };

  const columns: TableColumn[] = useMemo(() => [
    {
      key: "order_id",
      label: "ID Orden",
      render: (value: number) => `#${value || "N/A"}`
    },
    {
      key: "state",
      label: "Estado",
      render: (value: string) => value || "N/A"
    },
    {
      key: "machine_name",
      label: "Nombre de Maquinaria",
      render: (value: string) => value || "N/A"
    },
    {
      key: "start_date",
      label: "Fecha Inicio",
      render: (value: string) => {
        if (!value) return "N/A";
        return new Date(value).toLocaleDateString('es-ES');
      }
    },
    {
      key: "end_date",
      label: "Fecha Fin",
      render: (value: string) => {
        if (!value) return "N/A";
        return new Date(value).toLocaleDateString('es-ES');
      }
    },
  ], []);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleViewDetail = (item?: any) => {
    const order = item as OrderResponse;

    if (!order) return;

    console.log("📋 Visualizando detalle de orden:", order.order_id);

    getOrderDetailById(order.order_id)
      .then(detail => {
        console.log("📋 Respuesta de getOrderDetailById:", detail);
        if (detail) {
          console.log("📋 Detalle válido, seteando estados");
          setOrderDetail(detail);
          setDetailModalOpen(true);
        } else {
          console.log("❌ Detalle es null/undefined");
        }
      })
      .catch(error => {
        console.error("❌ Error en getOrderDetailById:", error);
      });
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setOrderDetail(null);
  };

  const actionButtons: ActionButton<OrderResponse>[] = useMemo(() => [
    {
      label: "Detalle",
      className: "table-action-button",
      onClick: (item?: OrderResponse) => handleViewDetail(item),
    },
    {
      label: "🗺️ Seguimiento",
      className: "table-action-button bg-green-500 hover:bg-green-600",
      onClick: (item?: OrderResponse) => {
        if (item) handleTrackOrder(item);
      },
      // TEMPORALMENTE: Mostrar siempre para debug - después ajustaremos la condición
      // condition: (order: OrderResponse) => true
    },
  ], []);

  return {
    items: filteredOrders,
    isLoading,
    error,
    searchValue,
    detailModalOpen,
    orderDetail,
    handleCloseDetailModal,
    handleTrackOrder, // Exportar para uso directo
    columns,
    actionButtons,
    onSearch: handleSearch,
    statusField: undefined,
    statusOptions: undefined,
    statusColors: undefined,
    onStatusChange: undefined,
  };
}