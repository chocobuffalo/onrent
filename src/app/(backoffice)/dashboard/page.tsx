"use client";

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import useOrdersTable from "@/hooks/frontend/ui/useOrdersTable";

const Dashboard = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  const {
    items: orders,
    isLoading,
    error,
    searchValue,
    detailModalOpen,
    orderDetail,
    handleCloseDetailModal,
    actionButtons,
    onSearch,
  } = useOrdersTable();

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug: Log orders to see the actual structure
  useEffect(() => {
    if (orders && orders.length > 0) {
      console.log("🔍 DEBUG: Primera orden:", orders[0]);
      console.log("🔍 DEBUG: Propiedades disponibles:", Object.keys(orders[0]));
    }
  }, [orders]);

  // Función para manejar el seguimiento GPS
  const handleTrackOrder = (order: any) => {
    console.log("🗺️ Orden completa:", order);
    
    // Múltiples opciones para obtener el ID de la máquina
    let deviceId = null;
    
    // Opción 1: machine_id directo
    if (order?.machine_id) {
      deviceId = order.machine_id;
    }
    // Opción 2: rental_items array
    else if (order?.rental_items && order.rental_items.length > 0) {
      deviceId = order.rental_items[0]?.machine_id;
    }
    // Opción 3: usar order_id como fallback
    else if (order?.order_id) {
      deviceId = order.order_id.toString();
      console.log("⚠️ Usando order_id como deviceId fallback");
    }

    if (deviceId) {
      console.log("✅ DeviceId encontrado:", deviceId);
      router.push(`/dashboard/tracking?deviceId=${deviceId}`);
    } else {
      console.error("❌ No se encontró ningún ID válido para el seguimiento");
      toast.error('ID de dispositivo no disponible para seguimiento.');
    }
  };

  // Show loading state during hydration
  if (!isClient) {
    return (
      <>
        <h1 className="admin-title">Dashboard</h1>
        <div className="text-center p-4">Cargando...</div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-title">Dashboard</h1>
      <div className="tfcl-dashboard-overview">
        <div className="row">
        </div>
      </div>
      <div className="tfcl-dashboard-middle mt-2">
        <div className="row">
          <div className="tfcl-dashboard-middle-left col-md-12">
            <div className="tfcl-dashboard-listing">
              <h5 className="title-dashboard-table">Mis Órdenes</h5>
              
              {/* Filtros de búsqueda */}
              <div className="row">
                <div className="col-xl-3 col-lg-6 mb-2">
                  <div className="group-input-icon search">
                    <input
                      type="text"
                      name="title_search"
                      id="title_search"
                      value={searchValue}
                      onChange={(e) => onSearch(e.target.value)}
                      placeholder="Buscar órdenes..."
                    />
                    <span className="datepicker-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M15.7506 15.7506L11.8528 11.8528M11.8528 11.8528C12.9078 10.7979 13.5004 9.36711 13.5004 7.87521C13.5004 6.38331 12.9078 4.95252 11.8528 3.89759C10.7979 2.84265 9.36711 2.25 7.87521 2.25C6.38331 2.25 4.95252 2.84265 3.89759 3.89759C2.84265 4.95252 2.25 6.38331 2.25 7.87521C2.25 9.36711 2.84265 10.7979 3.89759 11.8528C4.95252 12.9078 6.38331 13.5004 7.87521 13.5004C9.36711 13.5004 10.7979 12.9078 11.8528 11.8528Z"
                          stroke="#B6B6B6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="col-xl-9 col-lg-6 mb-2">
                  <span className="text-muted small">
                    Total: {orders?.length || 0} órdenes
                  </span>
                </div>
              </div>

              {/* Tabla de órdenes */}
              <div className="tfcl-table-listing">
                <div className="table-responsive">
                  <span className="result-text">
                    <b>{orders?.length || 0}</b> resultados encontrados
                  </span>
                  
                  {isLoading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p className="mt-2">Cargando órdenes...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center p-4">
                      <div className="alert alert-danger" role="alert">
                        <strong>Error:</strong> {error}
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                      >
                        Reintentar
                      </button>
                    </div>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID Orden</th>
                          <th>Maquinaria</th>
                          <th>Estado</th>
                          <th>Fecha Inicio</th>
                          <th>Fecha Fin</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="tfcl-table-content">
                        {orders && orders.length > 0 ? (
                          orders.map((order) => (
                            <tr key={order.order_id}>
                              <td>#{order.order_id || "N/A"}</td>
                              <td>{order.machine_name || "N/A"}</td>
                              <td>
                                <span className={`badge ${getStatusClass(order.state)}`}>
                                  {order.state || "N/A"}
                                </span>
                              </td>
                              <td>
                                {order.start_date 
                                  ? new Date(order.start_date).toLocaleDateString('es-ES')
                                  : "N/A"
                                }
                              </td>
                              <td>
                                {order.end_date 
                                  ? new Date(order.end_date).toLocaleDateString('es-ES')
                                  : "N/A"
                                }
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  {/* Botón Detalles */}
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      actionButtons[0].onClick(order);
                                    }}
                                    title="Ver detalles"
                                  >
                                    Detalles
                                  </button>
                                  
                                  {/* Botón Seguimiento GPS - siempre mostrar */}
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleTrackOrder(order)}
                                    title="Seguimiento GPS"
                                  >
                                    Seguimiento
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center p-4">
                              <div className="text-muted">
                                <p>No se encontraron órdenes</p>
                                <small>Intenta ajustar los filtros de búsqueda</small>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
                
                <div className="themesflat-pagination clearfix mt-40">
                  <ul>{/* Paginación si es necesario */}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      {detailModalOpen && orderDetail && (
        <div 
          className="modal fade show" 
          style={{ 
            display: 'block',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}
          onClick={handleCloseDetailModal}
        >
          <div 
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detalle de Orden #{orderDetail.order_id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetailModal}
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Estado:</strong> {orderDetail.state}</p>
                    <p><strong>Maquinaria:</strong> {orderDetail.machine_name}</p>
                    <p><strong>Proyecto:</strong> {orderDetail.project}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Fecha inicio:</strong> {orderDetail.start_date}</p>
                    <p><strong>Fecha fin:</strong> {orderDetail.end_date}</p>
                    <p><strong>Duración:</strong> {orderDetail.duration_days} días</p>
                  </div>
                </div>
                
                {orderDetail.work_description && (
                  <div className="mt-3">
                    <strong>Descripción del trabajo:</strong>
                    <p className="text-muted">{orderDetail.work_description}</p>
                  </div>
                )}

                <div className="mt-3">
                  <strong>Total:</strong> ${orderDetail.total_final?.toLocaleString()}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDetailModal}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    handleTrackOrder(orderDetail);
                    handleCloseDetailModal();
                  }}
                >
                  Ver Seguimiento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Función auxiliar para los estilos de estado
const getStatusClass = (status: string) => {
  if (!status) return 'bg-secondary';
  
  switch (status.toLowerCase()) {
    case 'active':
    case 'activo':
    case 'en progreso':
      return 'bg-success';
    case 'pending':
    case 'pendiente':
      return 'bg-warning';
    case 'cancelled':
    case 'cancelado':
      return 'bg-danger';
    case 'completed':
    case 'completado':
      return 'bg-info';
    default:
      return 'bg-secondary';
  }
};

export default Dashboard;