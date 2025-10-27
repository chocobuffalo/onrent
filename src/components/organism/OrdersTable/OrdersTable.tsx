"use client";

import { useState, useEffect } from "react";
import DynamicTable from "@/components/atoms/DynamicTable/DynamicTable";
import OrderDetailModal from "@/components/organism/OrderDetailModal/OrderDetailModal";
import ConfirmationModal from "@/components/organism/ConfirmationModal/ConfirmationModal";
import useOrdersTable from "@/hooks/frontend/ui/useOrdersTable";
import RatingModal from "@/components/organism/RatingModal/RatingModal"; 
import useOrders from "@/hooks/backend/useOrders";

const OrdersTable = () => {
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

  // 👇 estados para el RatingModal
  const [ratingOpen, setRatingOpen] = useState(false);
  const [orderForRating, setOrderForRating] = useState<any | null>(null);

  const { submitOrderRating, dismissOrderRating } = useOrders();

  // 👇 detectar automáticamente órdenes pendientes de calificación
  useEffect(() => {
    if (!items || items.length === 0) return;

    const pending = items.find(
      (o) =>
        o.state_code === "completed" &&
        (o.x_client_rating === 0 || o.x_client_rating === null) &&
        !o.rating_dismissed
    );

    if (pending) {
      setOrderForRating(pending);
      setRatingOpen(true);
    }
  }, [items]);

  return (
    <div className="orders-table-container p-6">
      <div className="orders-table-content orders-table">
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
        orderNumber={
          orderDetail
            ? items.find((item) => item.order_id)?.order_id?.toString()
            : ""
        }
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

      {/* 👇 Nuevo modal de calificación */}
      <RatingModal
        isOpen={ratingOpen}
        orderId={orderForRating?.order_id || null}
        orderName={orderForRating?.name}
        onSubmit={(rating) =>
          submitOrderRating(orderForRating.order_id, rating)
        }
        onDismiss={() => dismissOrderRating(orderForRating.order_id)}
        onClose={() => {
          setRatingOpen(false);
          setOrderForRating(null);
        }}
      />
    </div>
  );
};

export default OrdersTable;
