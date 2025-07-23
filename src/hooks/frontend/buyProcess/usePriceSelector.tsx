'use client';

import { setMaxPrice, setMinPrice } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { storage } from "@/utils/storage";

export default function usePriceSelector(){
    
    // Custom hook logic for price selection
   const dispatch = useUIAppDispatch();
   const mixPriceSelector = useUIAppSelector((state) => state.filters.rangePrice.min);
   const maxPriceSelector = useUIAppSelector((state) => state.filters.rangePrice.max);
   const filters = useUIAppSelector((state) => state.filters);
   
   const handlerSetMinPrice = (value: string) => {
        dispatch(setMinPrice(parseFloat(value)));
        // set data in local storage
        storage.setItem('filters', {...filters, rangePrice: {...filters.rangePrice, min: parseFloat(value)|| 0}});
   }

    const handlerSetMaxPrice = (value: string) => {
        dispatch(setMaxPrice(parseFloat(value)));
        // set data in local storage
        storage.setItem('filters', {...filters, rangePrice: {...filters.rangePrice, max: parseFloat(value)||0}});
    }
    
    return{
        minPrice: mixPriceSelector,
        maxPrice: maxPriceSelector,
        handlerSetMinPrice,
        handlerSetMaxPrice,
        setMinPrice,
        setMaxPrice
    }
}