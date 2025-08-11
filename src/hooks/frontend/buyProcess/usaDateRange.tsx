"use client";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
// import { useEffect, useState } from 'react';
import {
  setStartDate,
  setEndDate,
  setNeedProject,
} from "@/libs/redux/features/ui/filterSlicer";
import { storage } from "@/utils/storage";
import { compareDate } from "@/utils/compareDate";

export default function useDateRange() {
  const dispatch = useUIAppDispatch();
  const startDateSelector = useUIAppSelector(
    (state) => state.filters.startDate
  );
  const endDateSelector = useUIAppSelector((state) => state.filters.endDate);
  //   const getStorage = storage.getItem("filters");
  const filters = useUIAppSelector((state) => state.filters);

  const needProject = useUIAppSelector((state) => state.filters.needProject);

  

  //setStartDate,setEndDate
  const handleStartDateChange = (date: string) => {
    
    
    dispatch(setStartDate(date));
    dispatch(setNeedProject(compareDate(date || "", endDateSelector || "")));
    storage.setItem("filters", { ...filters, startDate: date, needProject: compareDate(date || "", endDateSelector || "") });
  };

  const handleEndDateChange = (date: string) => {
    dispatch(setEndDate(date));
    dispatch(setNeedProject(compareDate(startDateSelector || "", date || "")));
    storage.setItem("filters", { ...filters, endDate: date, needProject: compareDate(startDateSelector || "", date || "") });
  };


  return {
    startDate: startDateSelector || "",
    endDate: endDateSelector || "",
    handleStartDateChange,
    handleEndDateChange,
    needProject,

  };
}
