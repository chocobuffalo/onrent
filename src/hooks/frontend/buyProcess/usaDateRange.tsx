"use client";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
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
  const filters = useUIAppSelector((state) => state.filters);
  const needProject = useUIAppSelector((state) => state.filters.needProject);

  const getTodayWithoutTime = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const isPastDate = (dateString: string) => {
    if (!dateString) return false;
    
    const parts = dateString.split('-');
    let year, month, day;
    
    if (parts.length === 3 && parts[0].length === 4) {
      year = parseInt(parts[0]);
      month = parseInt(parts[1]) - 1;
      day = parseInt(parts[2]);
    } else if (parts.length === 3 && parts[2].length === 4) {
      day = parseInt(parts[0]);
      month = parseInt(parts[1]) - 1;
      year = parseInt(parts[2]);
    } else {
      const selectedDate = new Date(dateString);
      selectedDate.setHours(0, 0, 0, 0);
      const today = getTodayWithoutTime();
      return selectedDate < today;
    }
    
    const selectedDate = new Date(year, month, day);
    const today = getTodayWithoutTime();
    return selectedDate < today;
  };

  const handleStartDateChange = (date: string) => {
    if (isPastDate(date)) {
      console.warn('❌ No se pueden seleccionar fechas pasadas');
      return;
    }
    dispatch(setStartDate(date));
    dispatch(setNeedProject(compareDate(date || "", endDateSelector || "")));
    storage.setItem("filters", { 
      ...filters, 
      startDate: date, 
      needProject: compareDate(date || "", endDateSelector || "") 
    });
  };

  const handleEndDateChange = (date: string) => {
    if (isPastDate(date)) {
      return;
    }
    
    dispatch(setEndDate(date));
    dispatch(setNeedProject(compareDate(startDateSelector || "", date || "")));
    storage.setItem("filters", { 
      ...filters, 
      endDate: date, 
      needProject: compareDate(startDateSelector || "", date || "") 
    });
  };

  return {
    startDate: startDateSelector || "",
    endDate: endDateSelector || "",
    handleStartDateChange,
    handleEndDateChange,
    needProject,
  };
}
