"use client";

import DynamicTable from "@/components/atoms/DynamicTable/DynamicTable";
import OrderDetailModal from "@/components/organism/OrderDetailModal/OrderDetailModal";
import useOrdersTable from "@/hooks/frontend/ui/useOrdersTable";

export default function OrdersTable() {
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
  } = useOrdersTable();

  return (
    <div className="orders-table-container p-6">
      <div className="orders-table-header">
      </div>
      <div className="orders-table-content">
        <DynamicTable
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
    </div>
  );
}