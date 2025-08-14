"use client";
import { useEffect, useState } from "react";
import { useUIAppSelector } from "@/libs/redux/hooks";
import { CatalogueItem } from "@/components/organism/Catalogue/types";
import { interestLinks } from "@/constants/routes/frontend";
import { SelectInterface } from "@/types/iu";

export default function useCatalog(slug?: string) {
  const { type, rangePrice, startDate, endDate, location } = useUIAppSelector(
    (state) => state.filters
  );

  const [data, setData] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isValidDate = (d: unknown): d is string | number | Date => {
    if (!d) return false;
    const dateObj = new Date(d as any);
    return !isNaN(dateObj.getTime());
  };

  useEffect(() => {
    async function fetchCatalogue() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: "1",
          page_size: "20",
          national_only: "false",
        });

        const slugLower = slug?.toLowerCase() || "";
        if (slugLower && slugLower !== "catalogo") {
          const interestLink = interestLinks.find(
            (link) => link.name.toLowerCase() === slugLower
          );
          params.append(
            "machine_category",
            interestLink?.machine_category || slugLower
          );
        } else if (type && Array.isArray(type) && type.length > 0) {
          type.forEach((t) => {
            const interestLink = interestLinks.find(
              (link) => link.name.toLowerCase() === t.label.toLowerCase()
            );
            if (interestLink?.machine_category) {
              params.append("machine_category", interestLink.machine_category);
            }
          });
        }

        if (location && (location as SelectInterface).value) {
          params.append("location", (location as SelectInterface).value);
        }
        if (rangePrice?.min != null && rangePrice.min > 0) {
          params.append("min_price", rangePrice.min.toString());
        }
        if (rangePrice?.max != null && rangePrice.max > 0) {
          params.append("max_price", rangePrice.max.toString());
        }
        if (isValidDate(startDate)) {
          params.append("start_date", new Date(startDate).toISOString());
        }
        if (isValidDate(endDate)) {
          params.append("end_date", new Date(endDate).toISOString());
        }

        const apiBase = process.env.NEXT_PUBLIC_API_URL_ORIGIN;
        const url = apiBase
          ? `${apiBase}/api/catalog?${params.toString()}`
          : `/api/catalog?${params.toString()}`;

        console.log("🔍 URL Final de petición:", url);

        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const result = await res.json();
        if (!Array.isArray(result)) {
          throw new Error("Respuesta inesperada del servidor");
        }
        if (result.length === 0) {
          setError("No hay máquinas que coincidan con los filtros.");
          setData([]);
          return;
        }

        const mappedData: CatalogueItem[] = result.map((machine: any) => ({
          id: machine.id,
          name: machine.name,
          location: machine.location || "Ubicación no disponible",
          price: machine.list_price?.toString() || "0.00",
          image: machine.image || "/images/catalogue/machine5.jpg",
          machinetype:
            (Array.isArray(type) && type[0]?.label) ||
            (type as SelectInterface)?.label ||
            slug ||
            "maquinaria",
          machine_category: machine.machine_category || "other",
        }));

        setData(mappedData);
      } catch (err: any) {
        setError(err.message || "Error al cargar el catálogo");
      } finally {
        setLoading(false);
      }
    }

    fetchCatalogue();
  }, [type, rangePrice, startDate, endDate, location, slug]);

  return { data, loading, error };
}
