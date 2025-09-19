"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { OrderDetail } from "@/types/orders";
import "./OrderDetailModal.scss";

interface OrderDetailModalProps {
  isOpen: boolean;
  orderDetail: OrderDetail | null;
  orderNumber?: string;
  onClose: () => void;
}

export default function OrderDetailModal({ 
  isOpen,
  orderDetail, 
  orderNumber,
  onClose 
}: OrderDetailModalProps) {
  if (!isOpen || !orderDetail) return null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatState = (state: string) => {
    const stateMap: { [key: string]: string } = {
      'pending_payment': 'Pendiente',
      'completed': 'Completado',
      'in_progress': 'En Progreso',
      'cancelled': 'Cancelado'
    };
    return stateMap[state] || state;
  };

  const getStateClass = (state: string) => {
    const classMap: { [key: string]: string } = {
      'pending_payment': 'order-detail-modal__status--pending',
      'completed': 'order-detail-modal__status--completed',
      'in_progress': 'order-detail-modal__status--in-progress',
      'cancelled': 'order-detail-modal__status--cancelled'
    };
    return `order-detail-modal__status ${classMap[state] || 'order-detail-modal__status--pending'}`;
  };

  const modalContent = (
    <div 
      className="order-detail-modal__overlay"
      onClick={onClose}
    >
      <div 
        className="order-detail-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="order-detail-modal__header">
          <div className="order-detail-modal__header-info">
            <h2>Detalle de la Orden #{orderDetail.order_id || orderNumber || ''}</h2>
          </div>
          <button 
            className="order-detail-modal__header-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>
        
        {/* Body */}
        <div className="order-detail-modal__body">
          
          {/* Información principal */}
          <div className="order-detail-modal__main-info">
            <div className="order-detail-modal__main-info-item">
              <div className="label">Fecha</div>
              <p className="value">
                {orderDetail.start_date 
                  ? new Date(orderDetail.start_date).toLocaleDateString('es-ES') 
                  : '2024-01-17'
                }
              </p>
            </div>
            <div className="order-detail-modal__main-info-item">
              <div className="label">Estado</div>
              <span className={getStateClass(orderDetail.state || 'pending_payment')}>
                {orderDetail.state || 'pending_payment'}
              </span>
            </div>
            <div className="order-detail-modal__main-info-item">
              <div className="label">Total</div>
              <p className="value value--large value--accent">
                ${orderDetail.total_final?.toLocaleString() || "0"}
              </p>
            </div>
          </div>

          {/* Información del Cliente */}
          <div className="order-detail-modal__section">
            <h3 className="order-detail-modal__section-title">
              Información del Cliente
            </h3>
            <div className="order-detail-modal__client-info">
              <div className="order-detail-modal__client-info-grid">
                <div className="order-detail-modal__client-info-item">
                  <div className="field-label">Ubicación</div>
                  <p className="field-value">
                    {orderDetail.location_coords 
                      ? `Lat: ${(orderDetail.location_coords.lat || orderDetail.location_coords.additionalProp1)?.toFixed(6)}, Lng: ${(orderDetail.location_coords.lng || orderDetail.location_coords.additionalProp2)?.toFixed(6)}`
                      : 'No especificada'
                    }
                  </p>
                </div>
                <div className="order-detail-modal__client-info-item">
                  <div className="field-label">Máquina</div>
                  <p className="field-value">
                    {orderDetail.machine_name || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="order-detail-modal__section">
            <h3 className="order-detail-modal__section-title">Detalles del Servicio</h3>
            <div className="order-detail-modal__products-table">
              <table>
                <thead>
                  <tr>
                    <th>Proyecto</th>
                    <th>Duración</th>
                    <th>Precio Base</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {orderDetail.project || "Proyecto no especificado"}
                    </td>
                    <td>
                      {orderDetail.duration_days || 1} días
                    </td>
                    <td>
                      ${orderDetail.rental_total?.toLocaleString() || "0"}
                    </td>
                    <td>
                      ${orderDetail.rental_total?.toLocaleString() || "0"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen de costos */}
          <div className="order-detail-modal__section">
            <h3 className="order-detail-modal__section-title">Resumen de Costos</h3>
            <div className="order-detail-modal__costs">
              <div className="order-detail-modal__costs-row">
                <span className="cost-label">Precio del Servicio:</span>
                <span className="cost-value">${orderDetail.rental_total?.toLocaleString() || "0"}</span>
              </div>
              <div className="order-detail-modal__costs-row">
                <span className="cost-label">Costo de Flota:</span>
                <span className="cost-value">${orderDetail.fleet_cost?.toLocaleString() || "0"}</span>
              </div>
              <div className="order-detail-modal__costs-row">
                <span className="cost-label">Seguro:</span>
                <span className="cost-value">${orderDetail.insurance_cost?.toLocaleString() || "0"}</span>
              </div>
              <div className="order-detail-modal__costs-row">
                <span className="cost-label">Impuestos:</span>
                <span className="cost-value">${orderDetail.taxes?.toLocaleString() || "0"}</span>
              </div>
              <div className="order-detail-modal__costs-row order-detail-modal__costs-row--total">
                <span className="cost-label">Total Final:</span>
                <span className="cost-value">${orderDetail.total_final?.toLocaleString() || "0"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
}