"use client";

import { useEffect, useState } from "react";
import { useUIAppSelector } from "@/libs/redux/hooks";
import { CatalogueItem } from "@/components/organism/Catalogue/types";
import { interestLinks } from "@/constants/routes/frontend";
import { SelectInterface } from "@/types/iu";

/**
 * Hook personalizado para obtener el catálogo de máquinas desde la API,
 * aplicando filtros por categoría, rango de precio y fechas.
 *
 * @param slug - Parámetro opcional proveniente de la URL, que puede indicar una categoría.
 * @returns Objeto con:
 *  - `data`: lista de máquinas filtradas
 *  - `loading`: estado de carga
 *  - `error`: mensaje de error si ocurre
 *
 * Ejemplo de uso:
 * ```tsx
 * const { data, loading, error } = useCatalog("maquinaria-pesada");
 * ```
 */
export default function useCatalog(slug?: string) {
  // Estado global de filtros tomado desde Redux
  const { type, rangePrice, startDate, endDate } = useUIAppSelector(
    (state) => state.filters
  );

  // Estado local para los datos y control de carga/errores
  const [data, setData] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verifica si un valor es una fecha válida.
   * @param d - Valor a verificar.
   * @returns `true` si es fecha válida, `false` en caso contrario.
   */
  const isValidDate = (d: unknown): d is string | number | Date => {
    if (!d) return false;
    const dateObj = new Date(d as any);
    return !isNaN(dateObj.getTime());
  };

  useEffect(() => {
    /**
     * Función principal que construye la URL y obtiene los datos de la API.
     */
    async function fetchCatalogue() {
      try {
        setLoading(true);
        setError(null);

        // Parámetros base de la petición
        const params = new URLSearchParams({
          page: "1",
          page_size: "20",
          national_only: "false",
        });

        // Procesar el parámetro slug de la URL
        const slugLower = slug?.toLowerCase() || "";

        // Si hay slug y no es "catalogo", filtrar por categoría correspondiente
        if (slugLower && slugLower !== "catalogo") {
          const interestLink = interestLinks.find(
            (link) => link.name.toLowerCase() === slugLower
          );
          params.append(
            "machine_category",
            interestLink?.machine_category || slugLower
          );
        }
        // Si no hay slug, usar las categorías seleccionadas desde Redux
        else if (type && Array.isArray(type) && type.length > 0) {
          type.forEach((t) => {
            const interestLink = interestLinks.find(
              (link) => link.name.toLowerCase() === t.label.toLowerCase()
            );
            if (interestLink?.machine_category) {
              params.append("machine_category", interestLink.machine_category);
            }
          });
        }

        // Filtro de precios: solo se envían si son mayores a 0
        if (rangePrice?.min != null && rangePrice.min > 0) {
          params.append("min_price", rangePrice.min.toString());
        }
        if (rangePrice?.max != null && rangePrice.max > 0) {
          params.append("max_price", rangePrice.max.toString());
        }

        // Filtros de fecha: se envían en formato ISO si son válidas
        if (isValidDate(startDate)) {
          params.append("start_date", new Date(startDate).toISOString());
        }
        if (isValidDate(endDate)) {
          params.append("end_date", new Date(endDate).toISOString());
        }

        // Construcción de la URL final con base en variables de entorno
        const apiBase = process.env.NEXT_PUBLIC_API_URL_ORIGIN;
        const url = apiBase
          ? `${apiBase}/api/catalog?${params.toString()}`
          : `/api/catalog?${params.toString()}`;

        console.log("🔍 URL Final de petición:", url);

        // Petición HTTP GET
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Si la API responde con error HTTP
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        // Convertir la respuesta a JSON
        const result = await res.json();

        // Validar formato de respuesta
        if (!Array.isArray(result)) {
          throw new Error("Respuesta inesperada del servidor");
        }

        // Si no hay resultados, mostrar mensaje y limpiar datos
        if (result.length === 0) {
          setError("No hay máquinas que coincidan con los filtros.");
          setData([]);
          return;
        }

        // Transformar datos de la API al formato usado en el frontend
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

        // Guardar datos procesados en el estado
        setData(mappedData);
      } catch (err: any) {
        setError(err.message || "Error al cargar el catálogo");
      } finally {
        setLoading(false);
      }
    }

    // Ejecutar la carga de datos cuando cambian los filtros o el slug
    fetchCatalogue();
  }, [type, rangePrice, startDate, endDate, slug]);

  // Retornar datos y estados al componente que use el hook
  return { data, loading, error };
}
