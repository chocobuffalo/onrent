/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { setLocation } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { debounce } from "@/utils/debounce";
import { useCallback, useEffect, useState } from "react";
import { storage } from "@/utils/storage";

interface SearchResult {
  Place: {
    Label: string;
    Geometry: {
      Point: [number, number];
    };
  };
}

export default function useAutoComplete(checkpersist?: boolean) {
  const uiSelector = useUIAppSelector((state) => state.filters);
  const locationLabel = uiSelector.location?.label || "";
  
  const [inputValue, setInputValue] = useState<string>(locationLabel);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  const dispatch = useUIAppDispatch();

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

  const debouncedFilterColors = useCallback(
    debounce(async (inputValue: string) => {
      await searchPlaces(inputValue);
    }, 500),
    []
  );

  // Sincronizar con Redux cuando checkpersist está activo
  useEffect(() => {
    if (checkpersist) {
      setInputValue(uiSelector?.location?.label || "");
    }
  }, [uiSelector.location, checkpersist]);

  // Limpiar al montar si no debe persistir
  useEffect(() => {
    if (!checkpersist) {
      setInputValue("");
      dispatch(setLocation(null));
    }
  }, []);

  const handlerFocus = (text: string) => {
    if (text.trim()) {
      debouncedFilterColors(text);
      setOpen(true);
    }
  };

  const handlerInputChange = (text: string) => {
    setInputValue(text);
    debouncedFilterColors(text);
  };

  const handlerChange = (resultIndex: number) => {
    const result = searchResults[resultIndex];
    if (!result) return;

    const coords = result.Place.Geometry.Point;
    const fullAddress = result.Place.Label;
    const lat = coords[1];
    const lon = coords[0];

    setInputValue(fullAddress);

    // Actualizar Redux (la fuente de verdad)
    dispatch(
      setLocation({
        value: fullAddress,
        label: fullAddress,
        lat,
        lon,
        data: result
      })
    );
    
    // Persistir en localStorage
    const getStorage = storage.getItem("filters");
    storage.setItem("filters", {
      ...getStorage,
      location: { 
        value: fullAddress, 
        label: fullAddress, 
        lat, 
        lon 
      },
    });
    
    setOpen(false);
  };

  return {
    inputValue,
    setInputValue,
    isLoading,
    open,
    setOpen,
    handlerFocus,
    handlerInputChange,
    handlerChange,
    debouncedFilterColors,
    searchResults,
  };
}