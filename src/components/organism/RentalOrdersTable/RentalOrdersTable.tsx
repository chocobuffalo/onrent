"use client";

import { useState } from "react";
import RentalTable from "@/components/atoms/RentalTable/RentalTable";
import OrderDetailModal from "@/components/organism/OrderDetailModal/OrderDetailModal";
import ConfirmationModal from "@/components/organism/ConfirmationModal/ConfirmationModal";
import useOrdersTable from "@/hooks/frontend/ui/useOrdersTable";

const RentalOrdersTable = () => {
  const {
    items,
    isLoading,
    error,
    searchValue,
    columns,
    actionButtons,
    onSearch,
    statusField,
    statusOptions,
    statusColors,
    onStatusChange,
    detailModalOpen,
    orderDetail,
    handleCloseDetailModal,
    confirmModalOpen,
    modalConfig,
    actionLoading,
    handleConfirmAction,
    handleCancelAction,
  } = useOrdersTable();

  // Estado para rastrear órdenes confirmadas
  const [confirmedOrders, setConfirmedOrders] = useState<Set<number | string>>(new Set());
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<number | string | null>(null);

  // Interceptar los clics en los botones para guardar el tipo de acción
  const enhancedActionButtons = actionButtons.map(button => ({
    ...button,
    onClick: (item: any) => {
      setCurrentAction(button.label);
      setCurrentOrderId(item.order_id || item.id);
      button.onClick(item);
    }
  }));

  // Manejar confirmación con lógica adicional
  const handleEnhancedConfirmAction = async () => {
    await handleConfirmAction();
    
    // Solo agregar a confirmedOrders si la acción era "Confirmar"
    if (currentAction === 'Confirmar' && currentOrderId) {
      setConfirmedOrders(prev => new Set(prev).add(currentOrderId));
    }
    
    // Resetear el estado
    setCurrentAction(null);
    setCurrentOrderId(null);
  };

  // Manejar cancelación
  const handleEnhancedCancelAction = () => {
    handleCancelAction();
    setCurrentAction(null);
    setCurrentOrderId(null);
  };

  return (
    <div className="orders-table-container p-6">
      <div className="orders-table-content">
        <RentalTable
          title="Lista de Órdenes"
          items={items}
          isLoading={isLoading}
          error={error}
          searchValue={searchValue}
          columns={columns}
          statusField={statusField}
          statusOptions={statusOptions}
          statusColors={statusColors}
          actionButtons={enhancedActionButtons}
          onSearch={onSearch}
          onStatusChange={onStatusChange}
          confirmedOrders={confirmedOrders}
        />
      </div>

      {/* Modal de detalle de orden */}
      <OrderDetailModal
        isOpen={detailModalOpen}
        orderDetail={orderDetail}
        orderNumber={orderDetail ? items.find(item => item.order_id)?.order_id?.toString() : ''}
        onClose={handleCloseDetailModal}
      />

      {/* Modal de confirmación para confirmar/rechazar */}
      {modalConfig && (
        <ConfirmationModal
          isOpen={confirmModalOpen}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText="CANCELAR"
          variant={modalConfig.variant}
          loading={actionLoading}
          onConfirm={handleEnhancedConfirmAction}
          onCancel={handleEnhancedCancelAction}
        />
      )}
    </div>
  );
};

export default RentalOrdersTable;
