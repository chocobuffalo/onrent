"use client";

import DynamicTable from "@/components/atoms/DynamicTable/DynamicTable";
import AddOperator from "@/components/atoms/AddOperator/AddOperator";
import OperatorForm from "@/components/organism/OperatorForm/OperatorForm";
import OperatorDetailModal from "@/components/organism/OperatorDetailModal/OperatorDetailModal";
import EditOperatorForm from "@/components/organism/EditOperatorForm/EditOperatorForm";
import ConfirmationModal from "@/components/organism/ConfirmationModal/ConfirmationModal";
import useOperatorTableUI from "@/hooks/frontend/ui/useOperatorTableUI";
import "./OperatorTable.scss";

export default function OperatorTable() {
  const {
    createModalOpen,
    detailModalOpen,
    editModalOpen,
    selectedOperator,
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
    items,
    isLoading,
    error,
    searchValue,
    columns,
    actionButtons,
    onSearch,
  } = useOperatorTableUI();
  
  return (
    <>
      <div className="machine-table-container p-6">
        <div className="machine-table-header">
          <div className="machine-table-add-button">
            <AddOperator active={createModalOpen} func={handleAddOperator} />
          </div>
        </div>
        <div className="machine-table-content operators-table">
          <DynamicTable
            title="Lista de Operadores"
            items={items}
            isLoading={isLoading}
            error={error}
            searchValue={searchValue}
            columns={columns}
            actionButtons={actionButtons}
            onSearch={onSearch}
          />
        </div>

        {createModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>NUEVO OPERADOR</h2>
                <button 
                  className="modal-close-btn"
                  onClick={handleCloseCreateModal}
                >
                  ×
                </button>
              </div>
              <OperatorForm onCreated={handleCloseCreateModal} />
            </div>
          </div>
        )}

        {editModalOpen && selectedOperator && (
          <div className="edit-modal-overlay">
            <div className="edit-modal-content">
              <div className="edit-modal-header">
                <h2>EDITAR OPERADOR</h2>
                <button 
                  className="edit-modal-close-btn"
                  onClick={handleCloseEditModal}
                >
                  ×
                </button>
              </div>
              <EditOperatorForm 
                editData={selectedOperator}
                onSuccess={handleEditModalSuccess}
              />
            </div>
          </div>
        )}

        {detailModalOpen && selectedOperator && (
          <OperatorDetailModal
            operatorId={selectedOperator.operator_id}
            onClose={handleCloseDetailModal}
            refetch={async () => {}}
          />
        )}

        <ConfirmationModal
          isOpen={showDeleteModal}
          title="DESACTIVAR OPERADOR"
          message={`¿Estás seguro de desactivar al operador "${operatorToDelete?.name}"? Esta acción no se puede deshacer.`}
          confirmText="DESACTIVAR"
          cancelText="CANCELAR"
          onConfirm={handleConfirmDeactivate}
          onCancel={handleCancelDeactivate}
          variant="danger"
          loading={isDeleting}
        />
      </div>
    </>
  );
}
