"use client";
import { useState, useEffect } from "react";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { toggleModal } from "@/libs/redux/features/ui/modalSlicer";
import useMachineryList from "@/hooks/backend/useMachineryList";
import useDeleteMachinery from "@/hooks/frontend/ui/useDeleteMachinery";
import { MachineryResponse } from "@/types/machinary";

export default function useMachineTable() {
  const active = useUIAppSelector((state) => state.modal.isOpen);
  const dispatch = useUIAppDispatch();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<MachineryResponse | null>(null);
  
  // Estado para detectar cuando se acaba de crear exitosamente
  const [wasCreatedSuccessfully, setWasCreatedSuccessfully] = useState(false);
  
  // Función para editar
  const handleEdit = (item: MachineryResponse): void => {
    if (active) {
      dispatch(toggleModal());
    }
    
    setEditData(item);
    setShowEditModal(true);
  };
  
  // Hook para manejar eliminación con modal personalizado
  const { confirmAndDelete, modalProps } = useDeleteMachinery({
    onSuccess: async (deletedItem) => {
      // Eliminar del estado local en lugar de refrescar desde servidor
      machineryData.removeFromLocalState(deletedItem);
    }
  });
  
  const machineryData = useMachineryList({
    onEdit: handleEdit,
    onDelete: confirmAndDelete
  });

  // Escuchar evento personalizado para detectar creación exitosa
  useEffect(() => {
    const handleMachineryCreated = () => {
      setWasCreatedSuccessfully(true);
    };

    window.addEventListener('machineryCreated', handleMachineryCreated);

    return () => {
      window.removeEventListener('machineryCreated', handleMachineryCreated);
    };
  }, []);

  // Detectar cuando se acaba de crear exitosamente y modal se cierra
  useEffect(() => {
    // Si se marcó como creado exitosamente y el modal se cerró
    if (wasCreatedSuccessfully && !active) {
      // Pequeño delay para asegurar que la API ya procesó
      setTimeout(() => {
        machineryData.refreshList();
      }, 500);
      
      setWasCreatedSuccessfully(false);
    }
  }, [active, wasCreatedSuccessfully, machineryData.refreshList]);

  const handleAddEnginery = () => {
    setShowEditModal(false);
    setEditData(null);
    
    if (!active) {
      dispatch(toggleModal());
    }
  };

  // Success para editar - Refrescar desde servidor
  const handleEditFormSuccess = async (): Promise<void> => {
    try {
      // Cerrar modal primero
      setShowEditModal(false);
      setEditData(null);
      
      // Refrescar desde servidor después de editar
      await machineryData.refreshList();
    } catch (error) {
      // Error ya manejado por el hook de edición
    }
  };
  
  const handleCloseCreateModal = () => {
    dispatch(toggleModal());
  };
  
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditData(null);
  };

  return {
    // Estados de modales
    createModalOpen: active,
    editModalOpen: showEditModal,
    editData,
    
    // Handlers de modales
    handleAddEnginery,
    handleCloseCreateModal,
    handleCloseEditModal,
    handleEditFormSuccess,
    
    // Props del modal de confirmación
    modalProps,
    
    // Datos y configuración de la tabla
    items: machineryData.items,
    isLoading: machineryData.isLoading,
    error: machineryData.error,
    searchValue: machineryData.searchValue,
    columns: machineryData.columns,
    statusField: machineryData.statusField,
    statusOptions: machineryData.statusOptions,
    statusColors: machineryData.statusColors,
    actionButtons: machineryData.actionButtons,
    onSearch: machineryData.onSearch,
    onStatusChange: machineryData.onStatusChange,
  };
}