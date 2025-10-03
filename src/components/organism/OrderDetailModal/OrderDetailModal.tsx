"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { OrderDetail, LocationWithAddress } from "@/types/orders";
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
  const pathname = usePathname();
  const isRentalsPage = pathname?.includes('/rentals') || pathname?.includes('/rentas');

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

  if (!isOpen || !orderDetail) return null;

  const getLocationDisplay = (location: string | LocationWithAddress | undefined): string => {
    if (!location) return 'No especificada';
    if (typeof location === 'string') return location;
    
    if (location.address) return location.address;
    
    const lat = location.latitude ?? location.lat;
    const lng = location.longitude ?? location.lng;
    
    if (lat !== undefined && lng !== undefined) {
      return `Lat: ${lat}, Lng: ${lng}`;
    }
    
    return 'No especificada';
  };

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
          <div className={`order-detail-modal__main-info ${isRentalsPage ? 'order-detail-modal__main-info--rentals' : ''}`}>
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
            
            {/* Mostrar diferentes campos según la página */}
            {isRentalsPage ? (
              <>
                <div className="order-detail-modal__main-info-item">
                  <div className="label">Precio</div>
                  <p className="value value--large value--accent">
                    ${orderDetail.net_provider_price?.toLocaleString() || "15,500"}
                  </p>
                </div>
                <div className="order-detail-modal__main-info-item">
                  <div className="label">Comisión</div>
                  <p className="value value--large value--accent">
                    {orderDetail.commission_rate ? `${orderDetail.commission_rate}%` : "8.5%"}
                  </p>
                </div>
              </>
            ) : (
              <div className="order-detail-modal__main-info-item">
                <div className="label">Total</div>
                <p className="value value--large value--accent">
                  ${orderDetail.total_final?.toLocaleString() || "0"}
                </p>
              </div>
            )}
          </div>

          {/* Información del Cliente */}
          <div className="order-detail-modal__section">
            <h3 className="order-detail-modal__section-title">
              Información del Cliente
            </h3>
            <div className="order-detail-modal__client-info">
              <div className="order-detail-modal__client-info-grid">
                <div className="order-detail-modal__client-info-item">
                  <div className="field-label">Nombre</div>
                  <p className="field-value">
                    {orderDetail.client_name || orderDetail.name || 'No especificado'}
                  </p>
                </div>
                <div className="order-detail-modal__client-info-item">
                  <div className="field-label">Teléfono</div>
                  <p className="field-value">
                    {orderDetail.client_phone || 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de la maquinaria */}
          <div className="order-detail-modal__section">
            <h3 className="order-detail-modal__section-title">
              Información de la maquinaria
            </h3>
            <div className="order-detail-modal__products-table">
              <table>
                <thead>
                  <tr>
                    {orderDetail.project && <th>Producto</th>}
                    <th>Cantidad</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetail.items && orderDetail.items.length > 0 ? (
                    orderDetail.items.map((item, index) => (
                      <tr key={item.line_id || index}>
                        {orderDetail.project && <td>{item.product}</td>}
                        <td>{item.quantity}</td>
                        <td>{new Date(item.start_date).toLocaleDateString('es-ES')}</td>
                        <td>{new Date(item.end_date).toLocaleDateString('es-ES')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={orderDetail.project ? 4 : 3}>No hay productos disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detalles del Servicio - Solo si existe proyecto */}
          {orderDetail.project && (
            <div className="order-detail-modal__section">
              <h3 className="order-detail-modal__section-title">Detalles del Servicio</h3>
              <div className="order-detail-modal__products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre del Proyecto</th>
                      <th>Nombre del Responsable</th>
                      <th>Dirección</th>
                      <th>Teléfono</th>
                      <th>Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{orderDetail.project}</td>
                      <td>{orderDetail.responsible_name || 'No especificado'}</td>
                      <td>{getLocationDisplay(orderDetail.location)}</td>
                      <td>{orderDetail.responsible_phone || 'No especificado'}</td>
                      <td>{orderDetail.duration_days || 1} días</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
}