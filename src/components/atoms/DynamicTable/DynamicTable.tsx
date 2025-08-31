"use client";

import { ImSpinner8 } from "react-icons/im";
import { HiSearch, HiDocumentText } from "react-icons/hi";
import { Edit, Trash2 } from "lucide-react";
import { DynamicTableProps } from "@/types/machinary";

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
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-8 py-4 bg-[#13123D]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white futura-font uppercase tracking-wide">{title}</h2>
          <div className="bg-white bg-opacity-10 px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-white lato-font">
              {items.length} elemento{items.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        {onSearch && (
          <div className="relative max-w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <HiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Nombre, precio o fecha"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="block w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lato-font shadow-sm transition-all duration-200"
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
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-8 py-3 text-left text-xs font-bold text-white uppercase tracking-wider futura-font"
                  >
                    {column.label}
                  </th>
                ))}
                {statusField && (
                  <th className="px-8 py-3 text-left text-xs font-bold text-white uppercase tracking-wider futura-font">
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
                  {columns.map((column) => (
                    <td key={column.key} className="px-8 py-4 text-sm font-medium text-gray-900 lato-font">
                      {column.render ? column.render(item[column.key], item) : (item[column.key] || 'N/A')}
                    </td>
                  ))}
                  
                  {statusField && (
                    <td className="px-8 py-4">
                      <select
                        value={item[statusField] || ''}
                        onChange={(e) => onStatusChange && onStatusChange(item.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full focus:outline-none focus:ring-0 cursor-pointer transition-all duration-200 lato-font min-w-[120px] ${statusColors[item[statusField]?.toLowerCase()?.trim()] || 'bg-white text-black border-orange-500'}`}
                        style={{
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em'
                        }}
                      >
                        {statusOptions.map((option) => (
                          <option 
                            key={option.value} 
                            value={option.value} 
                            className="bg-white text-gray-800"
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}

                  {actionButtons.length > 0 && (
                    <td className="px-8 py-4">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          onClick={() => actionButtons[0]?.onClick(item)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 futura-font border border-orange-500"
                          title="Editar elemento"
                        >
                          <Edit className="h-3 w-3 text-orange-500" />
                          Editar
                        </button>
                        <button
                          onClick={() => actionButtons[1]?.onClick(item)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 futura-font border border-orange-500"
                          title="Eliminar elemento"
                        >
                          <Trash2 className="h-3 w-3 text-orange-500" />
                          Eliminar
                        </button>
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