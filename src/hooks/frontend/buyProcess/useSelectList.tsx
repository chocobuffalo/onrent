/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { setType } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { SelectInterface } from "@/types/iu";
import { storage } from "@/utils/storage";
import { useEffect, useState } from "react";

export default function useSelectList() {
  // Aquí puedes implementar la lógica para el componente SelectList
  const filters = useUIAppSelector((state) => state.filters);
  const filterStateType = useUIAppSelector((state) => state.filters.type);
  const dispatch = useUIAppDispatch();
  const [selectedType, setSelectedType] = useState<SelectInterface[]>(
    Array.isArray(filterStateType)
      ? filterStateType
      : filterStateType
      ? [filterStateType]
      : []
  );

  const handlerChange = (value: any) => {
    console.log(typeof value);
    setSelectedType(value);
    dispatch(setType(value));
    if (typeof window !== "undefined") {
      storage.setItem("filters", { ...filters, type: value });
    }
  };

  useEffect(() => {
    if (filterStateType) {
      setSelectedType(
        Array.isArray(filterStateType) ? filterStateType : [filterStateType]
      );
    }
  }, [filterStateType]);

  return {
    filterStateType,
    selectedType,
    setSelectedType,
    handlerChange,
    dispatch,
  };
}
