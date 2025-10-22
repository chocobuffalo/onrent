"use client";

import { useState, useEffect } from "react";
import useOperatorList from "@/hooks/backend/useOperatorList";
import { OperatorResponse } from "@/types/operator";
import deleteOperator from "@/services/deleteOperator.adapter";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function useOperatorTableUI() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<OperatorResponse | null>(null);
  
  // ✅ Estado para modal de confirmación de desactivar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [operatorToDelete, setOperatorToDelete] = useState<OperatorResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [wasCreatedSuccessfully, setWasCreatedSuccessfully] = useState(false);
  
  const { data: session } = useSession();
  const token = (session as any)?.accessToken || "";
  
  const handleEdit = (item: OperatorResponse): void => {
    if (createModalOpen) {
      setCreateModalOpen(false);
    }
    
    setSelectedOperator(item);
    setShowEditModal(true);
  };

  const handleDetail = (item: OperatorResponse): void => {
    if (createModalOpen) {
      setCreateModalOpen(false);
    }
    
    setSelectedOperator(item);
    setShowDetailModal(true);
  };

  // ✅ Handler para abrir modal de confirmación
  const handleDeactivate = async (item: OperatorResponse) => {
    setOperatorToDelete(item);
    setShowDeleteModal(true);
  };

  // ✅ Confirmar desactivación
  const handleConfirmDeactivate = async () => {
    if (!operatorToDelete) return;

    setIsDeleting(true);
    
    try {
      const result = await deleteOperator(token, operatorToDelete.operator_id);

      if (!result.success) {
        throw new Error(result.message || "Error al desactivar operador");
      }

      toast.success("Operador desactivado exitosamente");
      
    } catch (error: any) {
      console.error("❌ Error en desactivación:", error);
      toast.error(error.message || "Error al desactivar operador");
    } finally {
      // ✅ IMPORTANTE: Cerrar modal SIEMPRE en el finally
      setIsDeleting(false);
      setShowDeleteModal(false);
      setOperatorToDelete(null);
      
      // Refrescar la lista (sin await para no bloquear el cierre del modal)
      operatorData.refreshList().catch(err => {
        console.error("Error al refrescar lista:", err);
      });
    }
  };

  // ✅ Cancelar desactivación
  const handleCancelDeactivate = () => {
    setShowDeleteModal(false);
    setOperatorToDelete(null);
  };
  
  const operatorData = useOperatorList({
    onEdit: handleEdit,
    onDetail: handleDetail,
    onDeactivate: handleDeactivate,
  });

  useEffect(() => {
    const handleOperatorCreated = () => {
      setWasCreatedSuccessfully(true);
    };

    window.addEventListener('operatorCreated', handleOperatorCreated);

    return () => {
      window.removeEventListener('operatorCreated', handleOperatorCreated);
    };
  }, []);

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
    
    // ✅ Estados y handlers para modal de confirmación
    showDeleteModal,
    operatorToDelete,
    isDeleting,
    handleConfirmDeactivate,
    handleCancelDeactivate,
    
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
