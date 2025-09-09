"use client";
import DynamicTable from "@/components/atoms/DynamicTable/DynamicTable";
import AddEnginery from "@/components/atoms/AddEnginery/AddEnginery";
import MachineForm from "@/components/organism/machineForm/machineForm";
import EditMachineForm from "@/components/organism/EditMachineForm/EditMachineForm";
import ConfirmationModal from '@/components/organism/ConfirmationModal/ConfirmationModal';
import useMachineTable from "@/hooks/frontend/ui/useMachineTable";

export default function MachineTable() {
  const {
    // Estados de modales
    createModalOpen,
    editModalOpen,
    editData,
    
    // Handlers de modales
    handleAddEnginery,
    handleCloseCreateModal,
    handleCloseEditModal,
    handleEditFormSuccess,
    
    // Props del modal de confirmación
    modalProps,
    
    // Datos y configuración de la tabla
    items,
    isLoading,
    error,
    searchValue,
    columns,
    statusField,
    statusOptions,
    statusColors,
    actionButtons,
    onSearch,
    onStatusChange,
  } = useMachineTable();
  
  return (
    <div className="machine-table-container p-6">
      <div className="machine-table-header">
        <h1 className="machine-table-title">Gestión de maquinaria</h1>
        <div className="machine-table-add-button">
          <AddEnginery active={createModalOpen} func={handleAddEnginery} />
        </div>
      </div>
      <div className="machine-table-content">
        <DynamicTable
          title="Lista de Maquinarias"
          items={items}
          isLoading={isLoading}
          error={error}
          searchValue={searchValue}
          columns={columns}
          statusField={statusField}
          statusOptions={statusOptions}
          statusColors={statusColors}
          actionButtons={actionButtons}
          onSearch={onSearch}
          onStatusChange={onStatusChange}
        />
      </div>
      {createModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>NUEVA MAQUINARIA</h2>
              <button 
                className="modal-close-btn"
                onClick={handleCloseCreateModal}
              >
                ×
              </button>
            </div>
            <MachineForm />
          </div>
        </div>
      )}
      {editModalOpen && editData && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content">
            <div className="edit-modal-header">
              <h2>EDITAR MAQUINARIA</h2>
              <button 
                className="edit-modal-close-btn"
                onClick={handleCloseEditModal}
              >
                ×
              </button>
            </div>
            <EditMachineForm 
              editData={editData}
              onSuccess={handleEditFormSuccess}
            />
          </div>
        </div>
      )}
      
      {/* Modal de confirmación */}
      <ConfirmationModal {...modalProps} />
    </div>
  );
}