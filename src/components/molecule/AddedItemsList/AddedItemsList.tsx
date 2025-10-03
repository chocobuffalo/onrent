// src/components/molecule/AddedItemsList/AddedItemsList.tsx
import { currency } from "@/constants";

interface AddedItem {
  id: string;
  machineName: string;
  quantity: number;
  unitPrice: number;
  startDate: string;
  endDate: string;
  dayLength: number;
  totalPrice: number;
}

interface AddedItemsListProps {
  items: AddedItem[];
  onRemove: (id: string) => void;
}

export const AddedItemsList = ({ items, onRemove }: AddedItemsListProps) => {
  if (items.length === 0) return null;

  const grandTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h5 className="font-semibold text-sm mb-3 text-gray-800">
        Items agregados ({items.length})
      </h5>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-gray-200 rounded-lg p-3 flex items-start justify-between gap-3"
          >
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">
                {item.machineName}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Cantidad: <span className="font-medium">{item.quantity}</span> • 
                Duración: <span className="font-medium">{item.dayLength} días</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {item.startDate} al {item.endDate}
              </p>
              <p className="text-sm font-bold text-green-600 mt-2">
                {item.totalPrice.toLocaleString('es-ES')} {currency.code}
              </p>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Eliminando item con ID:", item.id); // Debug
                onRemove(item.id);
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1.5 transition-colors"
              title="Eliminar item"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Total general */}
      <div className="mt-4 pt-3 border-t border-gray-300 flex justify-between items-center">
        <p className="font-semibold text-gray-900">Total general:</p>
        <p className="text-lg font-bold text-green-600">
          {grandTotal.toLocaleString('es-ES')} {currency.code}
        </p>
      </div>
    </div>
  );
};
