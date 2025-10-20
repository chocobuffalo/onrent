"use client";

import React from "react";
import { ImSpinner8 } from "react-icons/im";
import { HiSearch, HiDocumentText } from "react-icons/hi";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { DynamicTableProps, TableColumn, StatusOption, ActionButton } from "@/types/machinary";
import "./RentalTable.scss";

const RentalTable: React.FC<DynamicTableProps> = ({
  title = "Lista de Órdenes",
  items = [],
  isLoading = false,
  error = null,
  searchValue = "",
  columns = [],
  statusField,
  statusOptions = [],
  statusColors = {},
  actionButtons = [],
  onSearch,
  onStatusChange,
  confirmedOrders = new Set(),
}) => {
 
  const showEmptyState = error || (items.length === 0 && !isLoading);
  
  const getButtonIcon = (buttonLabel: string) => {
    if (buttonLabel === 'Detalle') {
      return Eye;
    }
    if (buttonLabel === 'Confirmar') {
      return CheckCircle;
    }
    if (buttonLabel === 'Rechazar') {
      return XCircle;
    }
    return Eye;
  };

  // Función para filtrar botones según si la orden fue confirmada
  const getVisibleButtons = (item: any) => {
    const orderId = item.order_id || item.id;
    
    // Si la orden fue confirmada, ocultar botones de Confirmar y Rechazar
    if (confirmedOrders.has(orderId)) {
      return actionButtons.filter(button => 
        button.label !== 'Confirmar' && button.label !== 'Rechazar'
      );
    }
    
    return actionButtons;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden orders-table-container">
      <div className="px-8 py-4 bg-[#13123D]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="orders-table-title">{title}</h2>
          <div className="bg-white bg-opacity-10 px-3 py-1 rounded-full">
            <span className="orders-element-counter">
              {items.length} orden{items.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
        {onSearch && (
          <div className="orders-search-container">
            <div className="orders-search-icon-container">
              <HiSearch className="orders-search-icon" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre de maquinaria, ID orden o estado"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="orders-search-input"
            />
          </div>
        )}
      </div>
      
      <div className="orders-table-wrapper">
        {isLoading && items.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <ImSpinner8 className="h-8 w-8 animate-spin text-[#EA6300] mx-auto mb-4" />
              <p className="text-gray-600 lato-font">Cargando órdenes...</p>
            </div>
          </div>
        ) : showEmptyState ? (
          <div className="text-center py-16">
            <HiDocumentText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 futura-font">No hay órdenes</h3>
            <p className="text-gray-500 lato-font">
              {error ? 'Ocurrió un error al cargar las órdenes. El error se mostró en la notificación.' : 'No se encontraron órdenes para mostrar.'}
            </p>
          </div>
        ) : (
          <table className="orders-table">
            <thead className="orders-table-head">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="orders-table-header-cell"
                  >
                    {column.label}
                  </th>
                ))}
                {statusField && (
                  <th className="orders-table-header-cell orders-status-header">
                    ESTADO
                  </th>
                )}
                {actionButtons.length > 0 && (
                  <th className="orders-table-header-cell orders-actions-header">
                    ACCIONES
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="orders-table-body">
              {items.map((item, itemIndex) => {
                const visibleButtons = getVisibleButtons(item);
                
                return (
                  <tr key={item.id || item.order_id || itemIndex} className="orders-table-row">
                    {columns.map((column) => (
                      <td key={column.key} className="orders-table-cell">
                        {column.render ? column.render(item[column.key], item) : (item[column.key] || 'N/A')}
                      </td>
                    ))}
                    
                    {statusField && (
                      <td className="orders-table-cell orders-status-cell">
                        <select
                          value={item[statusField] || ''}
                          onChange={(e) => onStatusChange && onStatusChange(item.id, e.target.value)}
                          className={`orders-select ${statusColors[item[statusField]?.toLowerCase()?.trim()] || 'bg-white text-orange-500 border'}`}
                        >
                          {statusOptions.map((option) => (
                            <option 
                              key={option.value} 
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {visibleButtons.length > 0 && (
                      <td className="orders-table-cell orders-actions-cell">
                        <div className="orders-actions-container">
                          {visibleButtons.map((button, buttonIndex) => {
                            const IconComponent = getButtonIcon(button.label);
                            
                            return (
                              <button
                                key={buttonIndex}
                                onClick={() => {
                                  button.onClick(item);
                                }}
                                className={`orders-action-button ${button.className || ''}`}
                                title={`${button.label} orden`}
                              >
                                <IconComponent />
                                <span className={`orders-button-text ${button.className?.includes('icon-only') ? 'sr-only' : ''}`}>
                                  {button.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {isLoading && items.length > 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
          <div className="flex items-center space-x-3">
            <ImSpinner8 className="h-6 w-6 animate-spin text-[#EA6300]" />
            <span className="text-gray-700 lato-font font-medium">Actualizando órdenes...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalTable;
