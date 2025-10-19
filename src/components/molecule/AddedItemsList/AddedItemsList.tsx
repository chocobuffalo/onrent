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
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export const AddedItemsList = ({ 
  items, 
  onRemove, 
  onIncrement, 
  onDecrement 
}: AddedItemsListProps) => {
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
            className="relative bg-white border border-gray-200 rounded-lg p-3"
          >
            {/* Botón de eliminar - POSICIÓN CORREGIDA */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Eliminando item con ID:", item.id);
                onRemove(item.id);
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1.5 transition-colors z-10"
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

            {/* Contenido con padding-right para evitar overlap con la X */}
            <div className="pr-10">
              <p className="font-semibold text-sm text-gray-900">
                {item.machineName}
              </p>
              
              {/* Controles de cantidad */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDecrement(item.id);
                    }}
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 text-sm font-semibold border-x border-gray-300 min-w-[40px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onIncrement(item.id);
                    }}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                    title="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                
                <p className="text-xs text-gray-600">
                  Duración: <span className="font-medium">{item.dayLength} días</span>
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {item.startDate} al {item.endDate}
              </p>
              <p className="text-sm font-bold text-green-600 mt-2">
                {item.totalPrice.toLocaleString('es-ES')} {currency.code}
              </p>
            </div>
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
