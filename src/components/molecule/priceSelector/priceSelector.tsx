'use client';
import InputPrice from "@/components/atoms/inputPrice/inputPrice";
import usePriceSelector from "@/hooks/frontend/buyProcess/usePriceSelector";
import { storage } from "@/utils/storage";
import { useEffect } from "react";

export default function PriceSelector(){
    const {
        minPrice,
        maxPrice,
        handlerSetMinPrice,
        handlerSetMaxPrice
    } = usePriceSelector();

    // useEffect(()=>{
        
    //         const getMinPrice = storage.getItem('filters')?.rangePrice?.min;
    //         const getMaxPrice = storage.getItem('filters')?.rangePrice?.max;

    //         if(getMinPrice) handlerSetMinPrice(getMinPrice);
    //         if(getMaxPrice) handlerSetMaxPrice(getMaxPrice);
       
    // },[])


    return(
        <div className="price-selector flex flex-col gap-2 ">
            <h3 className=" text-[16px] font-bold text-left">
                    Precio
            </h3>
            {/* <input type="range" min={minPrice||0} max={maxPrice||100} step={10} onChange={(e)=>{handlerSetMaxPrice(e.target.value);}} /> */}
            <div className="range-inputs flex items-center justify-between gap-2.5">
                <InputPrice name="min-price" type="number" id="min-price" placeholder="Min Price " value={`${minPrice}`||'0'} onChange={handlerSetMinPrice} />
                <div className="separator  w-1/4 border-t-[#b2b2b23a] border-1"/>
                <InputPrice name="max-price" type="number" id="max-price" placeholder="Max Price" value={`${maxPrice}`||'0'} onChange={handlerSetMaxPrice} />
            </div>
        </div>
    )
}