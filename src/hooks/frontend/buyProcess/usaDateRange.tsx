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

  // Función para obtener la fecha de hoy sin tiempo
  const getTodayWithoutTime = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Función para validar si una fecha es pasada
  const isPastDate = (dateString: string) => {
    if (!dateString) return false;
    
    const selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    
    const today = getTodayWithoutTime();
    
    return selectedDate < today;
  };

  const handleStartDateChange = (date: string) => {
    // Validar que la fecha no sea pasada
    if (isPastDate(date)) {
      console.warn('No se pueden seleccionar fechas pasadas');
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
    // Validar que la fecha no sea pasada
    if (isPastDate(date)) {
      console.warn('No se pueden seleccionar fechas pasadas');
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
