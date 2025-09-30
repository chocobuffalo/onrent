"use client";
import { useState, useEffect, useCallback } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { debounce } from "@/utils/debounce";

interface EditFilterInputProps {
  initialValue: string;
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void;
  error?: string;
  name?: string;
  placeholder?: string;
}


interface SearchResult {
  Place: {
    Label: string;
    Geometry: {
      Point: [number, number];
    };
  };
}


const useAutoCompleteEdit = (initialValue: string) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (initialValue !== inputValue) {
      setInputValue(initialValue);
    }
  }, [initialValue]);


  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setOpen(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-map/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          center: [-123.115898, 49.295868]
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.Results && data.Results.length > 0) {
          setSearchResults(data.Results);
          setOpen(true);
        } else {
          setSearchResults([]);
          setOpen(false);
        }
      } else {
        setSearchResults([]);
        setOpen(false);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setSearchResults([]);
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const searchLocations = useCallback(
    debounce(async (query: string) => {
      await searchPlaces(query);
    }, 500),
    []
  );

  const handleInputChange = (text: string) => {
    setInputValue(text);
    
    if (text.trim()) {
      searchLocations(text);
    } else {
      setSearchResults([]);
      setOpen(false);
    }
  };

  const handleFocus = (text: string) => {
    if (text.trim()) {
      searchLocations(text);
      setOpen(true);
    }
  };

  return {
    inputValue,
    setInputValue,
    searchResults,
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
    searchResults,
    isLoading,
    open,
    setOpen,
    handleInputChange,
    handleFocus
  } = useAutoCompleteEdit(initialValue);

  const handleLocalInputChange = (value: string) => {
    handleInputChange(value);
    onChange(value);
  };

  const handleOptionSelect = (result: SearchResult) => {
    const coords = result.Place.Geometry.Point;
    const fullAddress = result.Place.Label;
    
    setInputValue(fullAddress);
    setOpen(false);
    
    onChange(fullAddress, {
      lat: coords[1],
      lng: coords[0]
    });
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 200);
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
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      
      <ul
        className={`listen-items border-gray-300 absolute z-10 bg-white border rounded-md w-full max-h-60 overflow-y-auto shadow-lg mt-2 ${
          open ? "block" : "hidden"
        }`}
      >
        {isLoading ? (
          <li className="list-item w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors">
            <ImSpinner8 color="#ea6300" size={20} className="animate-spin mx-auto" />
          </li>
        ) : searchResults.length > 0 ? (
          searchResults.map((result, index) => (
            <li key={index} className="list-item">
              <button
                type="button"
                className="w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors hover:bg-gray-200 text-left"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOptionSelect(result);
                }}
              >
                {result.Place.Label}
              </button>
            </li>
          ))
        ) : inputValue.trim() !== "" ? (
          <li className="list-item w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors">
            <span>No hay resultados</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default EditFilterInput;