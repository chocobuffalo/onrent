"use client";

import { useEffect, useState } from "react";
import { useUIAppSelector } from "@/libs/redux/hooks";
import { CatalogueItem } from "@/components/organism/Catalogue/types";
import { interestLinks } from "@/constants/routes/frontend";
import { SelectInterface } from "@/types/iu";

export default function useCatalog(slug?: string) {
  const { type, rangePrice, startDate, endDate } = useUIAppSelector(
    (state) => state.filters
  );

  const [data, setData] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCatalogue() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        // Categoría desde Redux (type)
        if (type) {
          const selectedTypes: SelectInterface[] = Array.isArray(type)
            ? type
            : [type as SelectInterface];

          selectedTypes.forEach((t) => {
            const interestLink = interestLinks.find(
              (link) =>
                link.name.toLowerCase() === t.label.toLowerCase()
            );
            if (interestLink?.machine_category) {
              params.append("category", interestLink.machine_category);
            }
          });
        }

        // Categoría desde slug (si viene)
        if (slug) {
          const interestLink = interestLinks.find(
            (link) => link.name.toLowerCase() === slug.toLowerCase()
          );
          if (interestLink?.machine_category) {
            params.append("category", interestLink.machine_category);
          } else {
            // si no está en interestLinks, lo usamos tal cual
            params.append("category", slug);
          }
        }

        // Rango de precios
        if (rangePrice?.min != null) {
          params.append("min_price", rangePrice.min.toString());
        }
        if (rangePrice?.max != null) {
          params.append("max_price", rangePrice.max.toString());
        }

        // Fechas
        if (startDate) params.append("start_date", startDate);
        if (endDate) params.append("end_date", endDate);

        const apiBase = process.env.NEXT_PUBLIC_API_URL_ORIGIN || "";
        const url = apiBase
          ? `${apiBase}/api/catalog?${params.toString()}`
          : `/api/catalog?${params.toString()}`;

        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        const result = await res.json();

        const mappedData: CatalogueItem[] = result.map((machine: any) => ({
          id: machine.id,
          name: machine.name,
          location: machine.location || "Ubicación no disponible",
          price: machine.price_per_day?.toString() || "0.00",
          image: machine.image_url || "/images/catalogue/machine5.jpg",
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
  }, [type, rangePrice, startDate, endDate, slug]);

  return { data, loading, error };
}
