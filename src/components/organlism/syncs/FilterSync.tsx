'use client';

import { setEndDate, setLocation, setMaxPrice, setMinPrice, setStartDate, setType, setUserID } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch } from "@/libs/redux/hooks";
import { useEffect } from "react";


export default function FilterSync() {
    const dispatch = useUIAppDispatch();
   

    useEffect(()=>{
       if(typeof window !== 'undefined'){
           const storageFilters = localStorage.getItem('filters');
           if(storageFilters){
               const { location, userID, type, startDate, endDate, rangePrice } = JSON.parse(storageFilters);
                if(location) dispatch(setLocation(location));
                if(userID) dispatch(setUserID(userID));
                if(type) dispatch(setType(type));
                if(startDate) dispatch(setStartDate(startDate));
                if(endDate) dispatch(setEndDate(endDate));
                if(rangePrice) {
                    dispatch(setMinPrice(rangePrice.min));
                    dispatch(setMaxPrice(rangePrice.max));
                }
           }
       }
    },[])

    return null;
}