"use client";

import DynamicTable from "@/components/atoms/DynamicTable/DynamicTable";
import AddOperator from "@/components/atoms/AddOperator/AddOperator";
import OperatorForm from "@/components/organism/OperatorForm/OperatorForm";
import OperatorDetailModal from "@/components/organism/OperatorDetailModal/OperatorDetailModal";
import EditOperatorForm from "@/components/organism/EditOperatorForm/EditOperatorForm";
import useOperatorTableUI from "@/hooks/frontend/ui/useOperatorTableUI";

export default function OperatorTable() {
  const {
    createModalOpen,
    detailModalOpen,
    editModalOpen,
    selectedOperator,
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
      <style jsx global>{`
        .modal-overlay,
        .edit-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(2px);
        }

        .modal-content,
        .edit-modal-content {
          background-color: white;
          border-radius: 12px;
          max-width: 90vw;
          max-height: 90vh;
          width: 800px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 10000;
        }

        .modal-header,
        .edit-modal-header {
          background-color: #13123D;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2,
        .edit-modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .modal-close-btn,
        .edit-modal-close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close-btn:hover,
        .edit-modal-close-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .modal-body {
          max-height: calc(90vh - 250px);
          overflow-y: auto;
        }

        /* Estilos para el footer y botón */
        .modal-footer,
        .group-button-submit {
          padding: 1.5rem 2rem 2rem 2rem !important;
          border-top: 1px solid #e5e7eb;
          background-color: #fafafa;
          margin: 0 !important;
        }

        .modal-footer.left {
          display: flex;
          justify-content: flex-start;
        }

        .group-button-submit .pre-btn {
          background-color: #EA6300 !important;
          color: white;
          padding: 0.875rem 2.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .group-button-submit .pre-btn:hover:not(:disabled) {
          background-color: #D15700 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(234, 99, 0, 0.4);
        }

        .group-button-submit .pre-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Ajustar el contenedor del formulario */
        .modal-body .container {
          padding: 0 !important;
        }

        .modal-body .row {
          margin: 0 !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .modal-content,
          .edit-modal-content {
            width: 95vw;
            max-height: 95vh;
          }

          .modal-header,
          .edit-modal-header {
            padding: 1rem 1.5rem;
          }

          .modal-header h2,
          .edit-modal-header h2 {
            font-size: 1.25rem;
          }

          .modal-footer,
          .group-button-submit {
            padding: 1rem 1.5rem 1.5rem 1.5rem !important;
          }

          .group-button-submit .pre-btn {
            width: 100%;
            min-width: auto;
            padding: 0.75rem 1.5rem;
          }
        }
      `}</style>

      <div className="machine-table-container p-6">
        <div className="machine-table-header">
          <div className="machine-table-add-button">
            <AddOperator active={createModalOpen} func={handleAddOperator} />
          </div>
        </div>
        <div className="machine-table-content">
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
      </div>
    </>
  );
}
