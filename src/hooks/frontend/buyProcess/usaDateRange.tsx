'use client';
import { useUIAppDispatch, useUIAppSelector } from '@/libs/redux/hooks';
import { useEffect, useState } from 'react';
import { setStartDate as setStartDateAction, setEndDate as setEndDateAction } from '@/libs/redux/features/ui/filterSlicer';
import { storage } from '@/utils/storage';

export default function useDateRange() {
    const dispatch = useUIAppDispatch();
    const startDateSelector = useUIAppSelector((state) => state.filters.startDate);
    const endDateSelector = useUIAppSelector((state) => state.filters.endDate);
    const getStorage = storage.getItem('filters');

    //setStartDate,setEndDate
    const handleStartDateChange = (date:string) => {
        console.log(date);
        dispatch(setStartDateAction(date));
        console.log(getStorage);
    };

    const handleEndDateChange = (date: string) => {
        console.log(date);
        dispatch(setEndDateAction(date));
        console.log(getStorage);
    };

    // useEffect(() => {
     
    //     if(typeof window !== 'undefined' ) {
    //         const storageFilters = localStorage.getItem('filters');
    //         if (storageFilters) {
    //             const { startDate, endDate } = JSON.parse(storageFilters);
    //             if(startDate !== null)dispatch(setStartDateAction(startDate));
    //             if(endDate !== null)dispatch(setEndDateAction(endDate));
    //         }
    //     }

    // }, [])

    return {
        startDate: startDateSelector || '',
        endDate: endDateSelector || '',
        handleStartDateChange,
        handleEndDateChange
    };
}