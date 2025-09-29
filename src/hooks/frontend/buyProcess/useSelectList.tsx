/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { setType } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { SelectInterface } from "@/types/iu";
import { storage } from "@/utils/storage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { interestLinks } from "@/constants/routes/frontend";

export default function useSelectList() {
  const filters = useUIAppSelector((state) => state.filters);
  const filterStateType = useUIAppSelector((state) => state.filters.type);
  const dispatch = useUIAppDispatch();
  const router = useRouter();
  
  const [selectedType, setSelectedType] = useState<SelectInterface[]>(
    Array.isArray(filterStateType)
      ? filterStateType
      : filterStateType
      ? [filterStateType]
      : []
  );

  const getFirstSelected = (
    v: SelectInterface[] | SelectInterface | null
  ): SelectInterface | null => {
    if (!v) return null;
    return Array.isArray(v) ? v[0] ?? null : v;
  };

  const handlerChange = (value: any) => {
    console.log(typeof value);
    setSelectedType(value);
    dispatch(setType(value));
  
    const firstType = getFirstSelected(value);
    const catalogueValue = firstType?.value || "";

    const basePath =
      interestLinks.find((link) => link.machine_category === catalogueValue)
        ?.slug || "/catalogo";

    const params = new URLSearchParams();

    const locationValue = filters.location?.value;
    if (locationValue) params.set("location", locationValue);

    if (filters.rangePrice?.min != null && filters.rangePrice.min > 0) {
      params.set("min_price", String(filters.rangePrice.min));
    }
    if (filters.rangePrice?.max != null && filters.rangePrice.max > 0) {
      params.set("max_price", String(filters.rangePrice.max));
    }

    if (filters.startDate) params.set("start_date", filters.startDate);
    if (filters.endDate) params.set("end_date", filters.endDate);

    const query = params.toString();
    const newURL = query ? `${basePath}?${query}` : basePath;
    
    router.push(newURL);

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