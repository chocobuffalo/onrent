'use client'
import { getLocationList } from "@/services/getLocationList.adapter";
import { SelectInterface } from "@/types/iu";
import { debounce } from "@/utils/debounce";
import { useCallback, useState } from "react";
export default function useLocation(){
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [options, setOptions] = useState<SelectInterface[]>([]);
    const [open, setOpen] = useState(false);

    const debouncedFilterColors = useCallback(
        debounce(async (inputValue: string) => {
          setIsLoading(true);
          try {
            const res = await getLocationList(inputValue || "Ciudad de Mexico");
            setOptions(res);
            setIsLoading(false);
            return res;
          } catch (error) {
            console.error("Error filtering colors:", error);
            setIsLoading(false);
            return options;
          }
        }, 500), // 500ms de delay
        [] // Dependencias vacías ya que no usamos variables externas
      );
    const handlerFocus = (text: string) => {
        debouncedFilterColors(text);
        setOpen(true);
    };

     const handlerInputChange = (text: string) => {
        debouncedFilterColors(text);
        setInputValue(text);
    };
    //setLocation,setType
  const handlerChange = (optionSelected: string) => {
    setInputValue(optionSelected)

    setOpen(false);
  };
    

    return {isLoading, open,options,inputValue, setInputValue,setOpen, handlerFocus,handlerChange,handlerInputChange}
}