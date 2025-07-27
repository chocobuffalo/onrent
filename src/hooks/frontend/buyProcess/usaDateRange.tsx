'use client';
import { useUIAppDispatch, useUIAppSelector } from '@/libs/redux/hooks';
import { useEffect, useState } from 'react';
import { setStartDate, setEndDate  } from '@/libs/redux/features/ui/filterSlicer';
import { storage } from '@/utils/storage';

export default function useDateRange() {
    const dispatch = useUIAppDispatch();
    const startDateSelector = useUIAppSelector((state) => state.filters.startDate);
    const endDateSelector = useUIAppSelector((state) => state.filters.endDate);
    const getStorage = storage.getItem('filters');
    const filters = useUIAppSelector((state) => state.filters);

    //setStartDate,setEndDate
    const handleStartDateChange = (date:string) => {
        console.log(date);
        dispatch(setStartDate(date));
        storage.setItem('filters', { ...filters, startDate: date });
    };

    const handleEndDateChange = (date: string) => {
        console.log(date);
        dispatch(setEndDate(date));
        storage.setItem('filters', { ...filters, endDate: date });

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