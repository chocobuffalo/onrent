"use client";

import { useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useOrders from "@/hooks/backend/useOrders";
import { OrderResponse, OrderDetail } from "@/types/orders";
import { TableColumn, ActionButton } from "../../../types/machinary";
import { acceptOrder } from "@/services/acceptOrder";
import { rejectOrder } from "@/services/rejectOrder";
import { toast } from "react-toastify";

export default function useOrdersTable() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'accept' | 'reject' | null>(null);
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<OrderResponse | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const pathname = usePathname();
  const isRentalsPage = pathname?.includes('/rentals') || pathname?.includes('/rentas');
  
  const { data: session } = useSession();
  const {
    orders,
    isLoading,
    error,
    getOrderDetailById,
    refreshOrders,
  } = useOrders();

  const token = (session as any)?.accessToken || "";

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

  // NUEVA FUNCIÓN AGREGADA - para el seguimiento GPS
  const handleTrackOrder = (order: OrderResponse) => {
    console.log("🗺️ Iniciando seguimiento para orden:", order.order_id);
    console.log("🔍 DEBUG - Estructura completa de order:", order);
    console.log("🔍 DEBUG - Propiedades de order:", Object.keys(order));
    
    let deviceId = null;
    
    if ((order as any)?.rental_items && (order as any).rental_items.length > 0) {
      deviceId = (order as any).rental_items[0]?.machine_id;
      console.log("✅ DeviceId desde rental_items:", deviceId);
    }
    else if ((order as any)?.machine_id) {
      deviceId = (order as any).machine_id;
      console.log("✅ DeviceId desde machine_id:", deviceId);
    }
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

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleViewDetail = (item?: any) => {
    const order = item as OrderResponse; 
    if (!order) return;
    
    getOrderDetailById(order.order_id)
      .then(detail => {
        if (detail) {
          setOrderDetail(detail);
          setDetailModalOpen(true);
        }
      })
      .catch(error => {
        console.error('Error al cargar el detalle de la orden:', error);
      });
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setOrderDetail(null);
  };

  const handleConfirmOrder = (item?: any) => {
    const order = item as OrderResponse;
    if (!order) return;
    setSelectedOrderForAction(order);
    setModalAction('accept');
    setConfirmModalOpen(true);
  };

  const handleRejectOrder = (item?: any) => {
    const order = item as OrderResponse;
    if (!order) return;
    setSelectedOrderForAction(order);
    setModalAction('reject');
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedOrderForAction || !modalAction) return;
    
    if (!token) {
      console.error("Token no disponible");
      return;
    }

    setActionLoading(true);
    
    try {
      let result;
      if (modalAction === 'accept') {
        result = await acceptOrder(selectedOrderForAction.order_id, token);
      } else {
        result = await rejectOrder(selectedOrderForAction.order_id, token);
      }

      if (result.success) {
        refreshOrders();
      }
    } catch (error) {
      console.error('Error al procesar la acción:', error);
    } finally {
      setActionLoading(false);
      setConfirmModalOpen(false);
      setSelectedOrderForAction(null);
      setModalAction(null);
    }
  };

  const handleCancelAction = () => {
    if (actionLoading) return;
    setConfirmModalOpen(false);
    setSelectedOrderForAction(null);
    setModalAction(null);
  };

  const actionButtons: ActionButton[] = useMemo(() => {
    if (isRentalsPage) {
      return [
        {
          label: "Confirmar",
          className: "table-action-button",
          onClick: handleConfirmOrder,
        },
        {
          label: "Rechazar",
          className: "table-action-button", 
          onClick: handleRejectOrder,
        },
        {
          label: "Detalle",
          className: "table-action-button table-action-button--icon-only",
          onClick: handleViewDetail,
        },
      ];
    } else {
      return [
        {
          label: "Detalle",
          className: "table-action-button",
          onClick: handleViewDetail,
        },
      ];
    }
  }, [isRentalsPage]);

  // Configuración del modal para acciones
  const getModalConfig = () => {
    if (!selectedOrderForAction || !modalAction) return null;

    const isAccept = modalAction === 'accept';
    return {
      title: isAccept ? 'CONFIRMAR ORDEN' : 'RECHAZAR ORDEN',
      message: isAccept 
        ? `¿Estás seguro de que deseas confirmar la orden #${selectedOrderForAction.order_id}?`
        : `¿Estás seguro de que deseas rechazar la orden #${selectedOrderForAction.order_id}?`,
      confirmText: isAccept ? 'CONFIRMAR ORDEN' : 'RECHAZAR ORDEN',
      variant: isAccept ? 'info' : 'warning' as 'info' | 'warning' | 'danger',
    };
  };

  return {
    items: filteredOrders,
    isLoading,
    error,
    searchValue,
    detailModalOpen,
    orderDetail,
    handleCloseDetailModal,
    confirmModalOpen,
    modalConfig: getModalConfig(),
    actionLoading,
    handleConfirmAction,
    handleCancelAction,
    columns,
    actionButtons,
    onSearch: handleSearch,
    statusField: undefined,
    statusOptions: undefined,
    statusColors: undefined,
    onStatusChange: undefined,
    handleTrackOrder,
  };
}