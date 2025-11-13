"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import CatalogueList from "./CatalogueList";
import { CatalogueItem } from "./types";

interface CatalogueContainerProps {
  items?: CatalogueItem[]; // ✅ ahora opcional
  searchValue?: string;
  selectionMode?: boolean;
  onSelectMachine?: (machine: CatalogueItem) => void;
}

export default function CatalogueContainer({ 
  items = [], // ✅ valor por defecto: []
  searchValue,
  selectionMode = false,
  onSelectMachine
}: CatalogueContainerProps) {
  const filters = useSelector((state: any) => state.filters);

  const filteredData = useMemo(() => {
    let result: CatalogueItem[] = items || [];

    // 🔎 Filtro por nombre
    if (searchValue && searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase().trim();
      result = result.filter((item: CatalogueItem) =>
        item.name?.toLowerCase().includes(searchTerm)
      );
    }

    // 🔎 Filtro por categoría
    const firstType = Array.isArray(filters.type) ? filters.type[0] : filters.type;
    if (firstType?.value) {
      result = result.filter((item: CatalogueItem) =>
        item.machine_category?.toLowerCase() === firstType.value.toLowerCase()
      );
    }

    // 🔎 Filtro por rango de precios usando list_price
    if (filters.rangePrice?.min != null && filters.rangePrice.min > 0) {
      result = result.filter((item: CatalogueItem) => item.list_price >= filters.rangePrice.min);
    }
    if (filters.rangePrice?.max != null && filters.rangePrice.max > 0) {
      result = result.filter((item: CatalogueItem) => item.list_price <= filters.rangePrice.max);
    }

    return result;
  }, [items, searchValue, filters]);

  return (
    <CatalogueList 
      items={filteredData} 
      selectionMode={selectionMode}
      onSelectMachine={onSelectMachine}
    />
  );
}
