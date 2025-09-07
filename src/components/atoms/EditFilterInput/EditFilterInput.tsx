"use client";
import { useState, useEffect, useCallback } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { getLocationList } from "@/services/getLocationList.adapter";
import { debounce } from "@/utils/debounce";
import { SelectInterface } from "@/types/iu";

interface EditFilterInputProps {
  initialValue: string;
  onChange: (value: string) => void;
  error?: string;
  name?: string;
  placeholder?: string;
}

// Hook simplificado para edición
const useAutoCompleteEdit = (initialValue: string) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [options, setOptions] = useState<SelectInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Sincronizar con valor inicial
  useEffect(() => {
    if (initialValue !== inputValue) {
      setInputValue(initialValue);
    }
  }, [initialValue]);

  // Función debounced para buscar ubicaciones
  const searchLocations = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true);
      try {
        const res = await getLocationList(query || "Ciudad de Mexico");
        setOptions(res);
      } catch (error) {
        console.error("Error searching locations:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleInputChange = (text: string) => {
    setInputValue(text);
    
    // Si está vacío, cargar ubicaciones por defecto
    // Si hay texto, buscar ubicaciones específicas
    const searchTerm = text.trim() === '' ? "Ciudad de Mexico" : text;
    searchLocations(searchTerm);
  };

  const handleFocus = (text: string) => {
    setOpen(true);
    
    // Buscar ubicaciones basadas en el texto actual o cargar por defecto
    const searchTerm = text && text.trim() !== '' ? text : "Ciudad de Mexico";
    searchLocations(searchTerm);
  };

  return {
    inputValue,
    setInputValue,
    options,
    isLoading,
    open,
    setOpen,
    handleInputChange,
    handleFocus
  };
};

const EditFilterInput = ({ 
  initialValue, 
  onChange, 
  error,
  name = "location_info",
  placeholder = "Indica tu ubicación"
}: EditFilterInputProps) => {
  const {
    inputValue,
    setInputValue,
    options,
    isLoading,
    open,
    setOpen,
    handleInputChange,
    handleFocus
  } = useAutoCompleteEdit(initialValue);

  // Manejar cambios en el input
  const handleLocalInputChange = (value: string) => {
    handleInputChange(value);
    onChange(value);
  };

  // Manejar selección de opciones
  const handleOptionSelect = (optionLabel: string) => {
    setInputValue(optionLabel);
    setOpen(false);
    onChange(optionLabel);
  };

  // Cerrar dropdown al hacer clic fuera
  const handleBlur = () => {
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="search-input relative w-full">
      <div className="input-item flex items-center gap-2 bg-white border border-gray-300 rounded-md px-2">
        <FaMapMarkerAlt className="text-black" />
        <input
          onFocus={() => handleFocus(inputValue)}
          onBlur={handleBlur}
          type="text"
          value={inputValue}
          name={name}
          onChange={(e) => handleLocalInputChange(e.target.value)}
          placeholder={placeholder}
          className="italic rounded-md p-2 w-full focus-visible:outline-none focus:border-secondary focus:ring-0"
        />
      </div>
      <ul
        className={`listen-items border-gray-300 absolute z-10 bg-white border rounded-md w-full max-h-60 overflow-y-auto shadow-lg mt-2 ${
          open ? "block" : "hidden"
        }`}
      >
        {options.length > 0 ? (
          options.map((option, index) => (
            <li key={`${option.value}-${index}`} className="list-item">
              <button
                type="button"
                className="w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors hover:bg-gray-200 text-left"
                onClick={() => handleOptionSelect(option.label)}
              >
                {option.label}
              </button>
            </li>
          ))
        ) : (
          <li className="list-item w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors">
            {isLoading ? (
              <ImSpinner8 color="#ea6300" size={20} className="animate-spin mx-auto" />
            ) : (
              <span>No hay resultados</span>
            )}
          </li>
        )}
      </ul>
    </div>
  );
};

export default EditFilterInput;