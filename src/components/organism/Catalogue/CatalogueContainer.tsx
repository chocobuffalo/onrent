"use client";

import { useMemo } from "react";
import CatalogueList from "./CatalogueList";
import useCatalog from "@/hooks/backend/useCatalogData";

export default function CatalogueContainer({ slug, searchValue }: { slug?: string; searchValue?: string }) {
  const { data, loading, error } = useCatalog(slug);

  const filteredData = useMemo(() => {
    if (!searchValue || !searchValue.trim()) return data;
    
    const searchTerm = searchValue.toLowerCase().trim();
    const filtered = data.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );

  
    return filtered.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
  
      if (aName === searchTerm && bName !== searchTerm) return -1;
      if (bName === searchTerm && aName !== searchTerm) return 1;
      
      if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm)) return -1;
      if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm)) return 1;
      
      return 0;
    });
  }, [data, searchValue]);

  if (loading) return <p className="text-center">Cargando catálogo...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return <CatalogueList items={filteredData} />;
}