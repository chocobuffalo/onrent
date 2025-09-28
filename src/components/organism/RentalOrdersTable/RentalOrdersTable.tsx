"use client";

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
          actionButtons={actionButtons}
          onSearch={onSearch}
          onStatusChange={onStatusChange}
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
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
        />
      )}
    </div>
  );
};

export default RentalOrdersTable;