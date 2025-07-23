'use client';
import InputPrice from "@/components/atoms/inputPrice/inputPrice";
import usePriceSelector from "@/hooks/frontend/buyProcess/usePriceSelector";
import { storage } from "@/utils/storage";
import { useEffect } from "react";

export default function PriceSelector(){
    const {
        minPrice,
        maxPrice,
        setMinPrice,
        setMaxPrice,
        handlerSetMinPrice,
        handlerSetMaxPrice
    } = usePriceSelector();

    useEffect(()=>{
        
            const getMinPrice = storage.getItem('filters')?.rangePrice?.min;
            const getMaxPrice = storage.getItem('filters')?.rangePrice?.max;

            if(getMinPrice) setMinPrice(getMinPrice);
            if(getMaxPrice) setMaxPrice(getMaxPrice);
       
    },[])


    return(
        <div className="price-selector flex flex-col gap-2 ">
            <input type="range" min={300} max={600} />
            <div className="range-inputs flex items-center justify-between gap-2.5">
                <InputPrice type="number" id="min-price" placeholder="Min Price " value={`${minPrice}`||'0'} onChange={handlerSetMinPrice} />
                <div className="separator  w-1/4 border-t-[#b2b2b23a] border-1"/>
                <InputPrice type="number" id="max-price" placeholder="Max Price" value={`${maxPrice}`||'0'} onChange={handlerSetMaxPrice} />
            </div>
        </div>
    )
}