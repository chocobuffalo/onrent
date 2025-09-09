"use client";

import { ImSpinner8 } from "react-icons/im";
import { HiSearch, HiDocumentText } from "react-icons/hi";
import { Edit, Trash2 } from "lucide-react";
import { DynamicTableProps } from "@/types/machinary";
import "./DynamicTable.scss";

export default function DynamicTable({
  title = "Lista de Elementos",
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
}: DynamicTableProps) {
 
  const showEmptyState = error || (items.length === 0 && !isLoading);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden dynamic-table-container">
      <div className="px-8 py-4 bg-[#13123D]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="mx-4 text-xl font-bold text-white futura-font uppercase tracking-wide">{title}</h2>
          <div className="bg-white bg-opacity-10 px-3 py-1 rounded-full">
            <span className="element-counter text-white lato-font">
              {items.length} elemento{items.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        {onSearch && (
          <div className="relative max-w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none search-icon-container">
              <HiSearch className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Nombre, categoría"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="search-input block w-full pr-4 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent lato-font shadow-sm transition-all duration-200"
            />
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        {isLoading && items.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <ImSpinner8 className="h-8 w-8 animate-spin text-[#EA6300] mx-auto mb-4" />
              <p className="text-gray-600 lato-font">Cargando datos...</p>
            </div>
          </div>
        ) : showEmptyState ? (
          <div className="text-center py-16">
            <HiDocumentText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 futura-font">No hay elementos</h3>
            <p className="text-gray-500 lato-font">
              {error ? 'Ocurrió un error al cargar los datos. El error se mostró en la notificación.' : 'No se encontraron elementos para mostrar.'}
            </p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-[#13123D]">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    className="px-8 py-3 text-left text-xs font-bold text-white uppercase tracking-wider futura-font"
                  >
                    {column.label}
                  </th>
                ))}
                {statusField && (
                  <th className="px-8 py-3 text-center text-xs font-bold text-white uppercase tracking-wider futura-font">
                    ESTADO
                  </th>
                )}
                {actionButtons.length > 0 && (
                  <th className="px-8 py-3 text-center text-xs font-bold text-white uppercase tracking-wider futura-font">
                    ACCIONES
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  {columns.map((column, colIndex) => (
                    <td key={column.key} className="px-8 py-4 font-medium lato-font">
                      {column.render ? column.render(item[column.key], item) : (item[column.key] || 'N/A')}
                    </td>
                  ))}
                  
                  {statusField && (
                    <td className="px-8 py-4 text-center">
                      <select
                        value={item[statusField] || ''}
                        onChange={(e) => onStatusChange && onStatusChange(item.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 pr-8 rounded-full focus:outline-none focus:ring-0 cursor-pointer transition-all duration-200 lato-font appearance-none ${statusColors[item[statusField]?.toLowerCase()?.trim()] || 'bg-white text-orange-500 border'}`}
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

                  {actionButtons.length > 0 && (
                    <td className="px-8 py-4">
                      <div className="button-container">
                        {actionButtons.map((button, buttonIndex) => (
                          <button
                            key={buttonIndex}
                            onClick={() => {
                              console.log(`🔧 Click en ${button.label}, item:`, item);
                              button.onClick(item);
                            }}
                            className="table-action-button futura-font"
                            title={`${button.label} elemento`}
                          >
                            {button.label === 'Editar' ? <Edit /> : <Trash2 />}
                            <span className="text-secondary">{button.label}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isLoading && items.length > 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
          <div className="flex items-center space-x-3">
            <ImSpinner8 className="h-6 w-6 animate-spin text-[#EA6300]" />
            <span className="text-gray-700 lato-font font-medium">Actualizando...</span>
          </div>
        </div>
      )}
    </div>
  );
}