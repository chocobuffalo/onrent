"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { getOrdersList } from "@/services/getOrders";
import { getOrderDetail } from "@/services/getOrderDetail";
import { OrderResponse, OrderDetail } from "@/types/orders";

export default function useOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Usar el mismo patrón que en useMachineryList
  const token = (session as any)?.accessToken || "";

  const fetchOrders = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getOrdersList(token);

      if (result.success && result.data) {
        setOrders(result.data);
        console.log("Órdenes cargadas:", result.data.length);
      } else {
        setError(result.message || "Error al cargar órdenes");
        toast.error(result.message || "Error al cargar las órdenes");
        
        if (result.error === "Unauthorized") {
          // Manejar redirección al login si es necesario
        }
      }
    } catch (error) {
      console.error("Error en fetchOrders:", error);
      setError("Error de conexión al cargar las órdenes");
      toast.error("Error de conexión al cargar las órdenes");
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderDetailById = async (orderId: number): Promise<OrderDetail | null> => {
    if (!token) {
      toast.error("Sesión expirada");
      return null;
    }

    try {
      toast.info("Cargando detalle de la orden...");
      const result = await getOrderDetail(orderId, token);

      if (result.success && result.data) {
        toast.success("Detalle de orden cargado");
        return result.data;
      } else {
        toast.error(result.message || "Error al cargar el detalle de la orden");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener detalle de orden:", error);
      toast.error("Error de conexión al cargar el detalle");
      return null;
    }
  };

  const refreshOrders = () => {
    fetchOrders();
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Escuchar eventos de actualización
  useEffect(() => {
    const handleOrderUpdate = () => {
      fetchOrders();
    };

    window.addEventListener('orderUpdated', handleOrderUpdate);
    return () => {
      window.removeEventListener('orderUpdated', handleOrderUpdate);
    };
  }, []);

  return {
    orders,
    isLoading,
    error,
    refreshOrders,
    getOrderDetailById,
  };
}