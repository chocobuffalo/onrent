"use client";

import CatalogueList from "./CatalogueList";
import useCatalog from "@/hooks/backend/useCatalog";

export default function CatalogueContainer({ slug }: { slug?: string }) {
  const { data, loading, error } = useCatalog(slug);

  if (loading) return <p className="text-center">Cargando catálogo...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return <CatalogueList items={data} />;
}
