"use client";

import { useState, useMemo } from "react";
import useOrders from "@/hooks/backend/useOrders";
import { OrderResponse, OrderDetail } from "@/types/orders";
import { TableColumn, ActionButton } from "../../../types/machinary";

export default function useOrdersTable() {
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


  const actionButtons: ActionButton[] = useMemo(() => [
    {
      label: "Detalle",
      className: "table-action-button",
      onClick: handleViewDetail,
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
    

    columns,
    actionButtons,

    onSearch: handleSearch,
    
 
    statusField: undefined,
    statusOptions: undefined,
    statusColors: undefined,
    onStatusChange: undefined,
  };
}