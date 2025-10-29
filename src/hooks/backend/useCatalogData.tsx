"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useUIAppSelector } from "@/libs/redux/hooks";
import { CatalogueItem } from "@/components/organism/Catalogue/types";
import { interestLinks } from "@/constants/routes/frontend";
import { SelectInterface } from "@/types/iu";

export default function useCatalog(slug?: string) {
  const { data: session, status } = useSession();
  const token = session?.user?.access_token;
  const searchParams = useSearchParams();
  const { type, rangePrice } = useUIAppSelector((state) => state.filters);

  const [data, setData] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const spKey = useMemo(() => searchParams.toString(), [searchParams]);

  const fromInterestByName = (name?: string) =>
    interestLinks.find((l) => l.name.toLowerCase() === (name || "").toLowerCase());

  const isKnownCategory = (val?: string) =>
    ["heavy", "light", "special", "other"].includes((val || "").toLowerCase());

  const extractCategoryFromRedux = (t: unknown): string | undefined => {
    if (Array.isArray(t) && t.length > 0) {
      const first = t[0] as SelectInterface;
      if (first?.value && typeof first.value === "string") return first.value;
      const mapped = fromInterestByName(first?.label)?.machine_category;
      return mapped;
    }
    if (t && typeof t === "object") {
      const obj = t as SelectInterface;
      if (obj?.value && typeof obj.value === "string") return obj.value;
      const mapped = fromInterestByName(obj?.label)?.machine_category;
      return mapped;
    }
    return undefined;
  };

  useEffect(() => {
    async function fetchCatalogue() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        params.set("page", searchParams.get("page") || "1");
        params.set("page_size", searchParams.get("page_size") || "20");
        params.set("national_only", searchParams.get("national_only") || "false");

        let machineCategory =
          searchParams.get("machine_category") || undefined;

        if (!machineCategory) {
          const slugLower = (slug || "").toLowerCase();
          if (slugLower && slugLower !== "catalogo") {
            const mapped = fromInterestByName(slugLower)?.machine_category;
            if (mapped) machineCategory = mapped;
            else if (isKnownCategory(slugLower)) machineCategory = slugLower;
          }
        }
        if (!machineCategory) {
          machineCategory = extractCategoryFromRedux(type);
        }

        if (machineCategory) {
          params.set("machine_category", machineCategory);
        }
        
        const machineType = searchParams.get("machine_type");
        if (machineType) params.set("machine_type", machineType);

        // --- precios: URL > Redux ---
        const minUrl = searchParams.get("min_price");
        const maxUrl = searchParams.get("max_price");

        if (minUrl) {
          params.set("min_price", minUrl);
        } else if (rangePrice?.min != null && rangePrice.min > 0) {
          params.set("min_price", String(rangePrice.min));
        }

        if (maxUrl) {
          params.set("max_price", maxUrl);
        } else if (rangePrice?.max != null && rangePrice.max > 0) {
          params.set("max_price", String(rangePrice.max));
        }

        const apiBase = process.env.NEXT_PUBLIC_API_URL_ORIGIN;
        const url = apiBase
          ? `${apiBase}/api/catalog?${params.toString()}`
          : `/api/catalog?${params.toString()}`;

        console.log("🔍 URL Final de petición:", url);

        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }  

        console.log("👉 Token que se envía al catálogo:", headers["Authorization"]);

        const res = await fetch(url, { method: "GET", headers });
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const result = await res.json();
        if (!Array.isArray(result))
          throw new Error("Respuesta inesperada del servidor");

        // Normalizamos al tipo CatalogueItem esperado por el front
        const mapped: CatalogueItem[] = result.map((m: any) => ({
          id: m.id,
          name: m.name,
          location: m.location || "Ubicación no disponible",
          price: String(m.list_price ?? "0"),
          image: m.image || "/images/catalogue/machine5.jpg",
          machinetype: machineCategory || "maquinaria",
          machine_category: machineCategory || "other",
        }));

        setData(mapped);
      } catch (err: any) {
        setError(err.message || "Error al cargar el catálogo");
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    // 🚦 Condiciones claras para evitar 401
    if (status === "unauthenticated") {
      fetchCatalogue(); // público
    } else if (status === "authenticated" && token) {
      fetchCatalogue(); // logueado con token válido
    }
  }, [slug, spKey, type, rangePrice, status, token]);

  return { data, loading, error };
}
