"use client";

import { useState, useEffect } from "react";
import useOperatorList from "@/hooks/backend/useOperatorList";
import { OperatorResponse } from "@/types/operator";
import deleteOperator from "@/services/deleteOperator.adapter";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function useOperatorTableUI() {
  // ✅ Usar estado local en lugar de Redux
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<OperatorResponse | null>(null);
  
  const [wasCreatedSuccessfully, setWasCreatedSuccessfully] = useState(false);
  
  const { data: session } = useSession();
  const token = (session as any)?.accessToken || "";
  
  // Handler para editar
  const handleEdit = (item: OperatorResponse): void => {
    // Cerrar modal de creación si está abierto
    if (createModalOpen) {
      setCreateModalOpen(false);
    }
    
    setSelectedOperator(item);
    setShowEditModal(true);
  };

  // Handler para ver detalle
  const handleDetail = (item: OperatorResponse): void => {
    // Cerrar modal de creación si está abierto
    if (createModalOpen) {
      setCreateModalOpen(false);
    }
    
    setSelectedOperator(item);
    setShowDetailModal(true);
  };

  // Handler para DESACTIVAR
  const handleDeactivate = async (item: OperatorResponse) => {
    if (!confirm(`¿Estás seguro de desactivar al operador "${item.name}"?`)) {
      return;
    }

    try {
      const result = await deleteOperator(token, item.operator_id);

      if (!result.success) {
        throw new Error(result.message || "Error al desactivar operador");
      }

      toast.success("Operador desactivado exitosamente");
      await operatorData.refreshList();
    } catch (error: any) {
      toast.error(error.message || "Error al desactivar operador");
    }
  };
  
  const operatorData = useOperatorList({
    onEdit: handleEdit,
    onDetail: handleDetail,
    onDeactivate: handleDeactivate,
  });

  // Escuchar evento de creación
  useEffect(() => {
    const handleOperatorCreated = () => {
      setWasCreatedSuccessfully(true);
    };

    window.addEventListener('operatorCreated', handleOperatorCreated);

    return () => {
      window.removeEventListener('operatorCreated', handleOperatorCreated);
    };
  }, []);

  // Refrescar lista después de crear
  useEffect(() => {
    if (wasCreatedSuccessfully && !createModalOpen) {
      setTimeout(() => {
        operatorData.refreshList();
      }, 500);
      
      setWasCreatedSuccessfully(false);
    }
  }, [createModalOpen, wasCreatedSuccessfully, operatorData.refreshList]);

  const handleAddOperator = () => {
    setShowDetailModal(false);
    setShowEditModal(false);
    setSelectedOperator(null);
    
    // ✅ Abrir modal con estado local
    setCreateModalOpen(true);
  };

  const handleEditModalSuccess = async (): Promise<void> => {
    try {
      setShowEditModal(false);
      setSelectedOperator(null);
  
      await operatorData.refreshList();
    } catch (error) {
      console.error("Error al refrescar lista:", error);
    }
  };
  
  const handleCloseCreateModal = () => {
    // ✅ Cerrar modal con estado local
    setCreateModalOpen(false);
  };
  
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOperator(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedOperator(null);
  };

  return {
    createModalOpen,
    detailModalOpen: showDetailModal,
    editModalOpen: showEditModal,
    selectedOperator,
    
    handleAddOperator,
    handleCloseCreateModal,
    handleCloseDetailModal,
    handleCloseEditModal,
    handleEditModalSuccess,
    
    items: operatorData.items,
    isLoading: operatorData.isLoading,
    error: operatorData.error,
    searchValue: operatorData.searchValue,
    columns: operatorData.columns,
    actionButtons: operatorData.actionButtons,
    onSearch: operatorData.onSearch,
  };
}
