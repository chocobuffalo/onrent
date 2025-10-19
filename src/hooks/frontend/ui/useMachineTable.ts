"use client";
import { useState, useEffect } from "react";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { toggleModal } from "@/libs/redux/features/ui/modalSlicer";
import useMachineryList from "@/hooks/backend/useMachineryList";
import { MachineryResponse } from "@/types/machinary";

export default function useMachineTable() {
  const active = useUIAppSelector((state) => state.modal.isOpen);
  const dispatch = useUIAppDispatch();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<MachineryResponse | null>(null);
  
  const [wasCreatedSuccessfully, setWasCreatedSuccessfully] = useState(false);
  
  const handleEdit = (item: MachineryResponse): void => {
    if (active) {
      dispatch(toggleModal());
    }
    
    setEditData(item);
    setShowEditModal(true);
  };
  
  const machineryData = useMachineryList({
    onEdit: handleEdit
  });

  useEffect(() => {
    const handleMachineryCreated = () => {
      setWasCreatedSuccessfully(true);
    };

    window.addEventListener('machineryCreated', handleMachineryCreated);

    return () => {
      window.removeEventListener('machineryCreated', handleMachineryCreated);
    };
  }, []);

  useEffect(() => {
    if (wasCreatedSuccessfully && !active) {
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

  const handleEditFormSuccess = async (): Promise<void> => {
    try {
      setShowEditModal(false);
      setEditData(null);
  
      await machineryData.refreshList();
    } catch (error) {

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
    createModalOpen: active,
    editModalOpen: showEditModal,
    editData,
    
    handleAddEnginery,
    handleCloseCreateModal,
    handleCloseEditModal,
    handleEditFormSuccess,
    
    items: machineryData.items,
    isLoading: machineryData.isLoading,
    error: machineryData.error,
    searchValue: machineryData.searchValue,
    columns: machineryData.columns,
    actionButtons: machineryData.actionButtons,
    onSearch: machineryData.onSearch,
  };
}
