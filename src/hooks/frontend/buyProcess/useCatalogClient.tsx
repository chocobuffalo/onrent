'use client';

import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/libs/redux/features/ui/modalSlicer";
import { setType } from "@/libs/redux/features/ui/filterSlicer";
import Modal from "@/components/molecule/Modal/modal";
import FilterComponent, { FilterComponentHandle } from "@/components/organism/FilterComponent/FilterComponent";
import Catalogue from "@/components/organism/Catalogue/CatalogueContainer";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";
import { typeOptions } from "@/constants/routes/home";
import dynamic from "next/dynamic";
const SelectList = dynamic(() => import("@/components/atoms/selectList/selectList"), { ssr: false });
import { useRouter, useSearchParams } from "next/navigation";
import { useGeolocation } from "@/hooks/frontend/ui/UseGeolocation";
import { CatalogueItem } from "@/components/organism/Catalogue/types";

export default function CatalogClient({ slug }: { slug?: string }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterRef = useRef<FilterComponentHandle | null>(null);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { location } = useGeolocation();

  useEffect(() => {
    if (slug) {
      const typeFromSlug = typeOptions.find(option => {
        return option.slug?.includes(slug) || option.value === slug;
      });

      if (typeFromSlug) {
        console.log("🔎 Tipo detectado desde slug:", typeFromSlug);
        dispatch(setType(typeFromSlug));
      }
    }
  }, [slug, dispatch]);

  // -------- Fetch catálogo (estable y con loader) --------
  useEffect(() => {
    // estabilizar dependencias a primitivas
    const paramsStr = searchParams.toString();
    const locLat = location?.lat ?? null;
    const locLon = location?.lng ?? null;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const controller = new AbortController();

    debounceTimer = setTimeout(() => {
      // reconstruir params desde la cadena original
      const params = new URLSearchParams(paramsStr);

      // mantener tu lógica de normalización location -> region
      const locationParam = searchParams.get("location");
      if (locationParam && !searchParams.get("region")) {
        params.delete("location");
        params.set("region", locationParam);
      }

      const regionParam = params.get("region");
      if (regionParam) {
        params.set("region", regionParam);
      } else if (locLat != null && locLon != null) {
        params.set("lat", String(locLat));
        params.set("lon", String(locLon));
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/catalog?${params.toString()}`;
      console.log("➡️ Fetch catálogo (debounced) con URL:", url);

      setIsLoading(true);
      fetch(url, { signal: controller.signal })
        .then(res => {
          console.log("⬅️ Response status:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("⬅️ Response body:", data);
          setItems(data);
        })
        .catch(err => {
          if ((err as any)?.name === "AbortError") {
            console.log("⚠️ Fetch abortado (intencional)");
            return;
          }
          console.error("❌ Error cargando catálogo:", err);
          setItems([]);
        })
        .finally(() => {
          // solo desactivar loading si esta petición no fue abortada
          if (!controller.signal.aborted) setIsLoading(false);
        });
    }, 120); // debounce corto

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      controller.abort();
    };
    // deps estables: string + primitivos
  }, [searchParams.toString(), location?.lat, location?.lng]);

  useEffect(() => {
    console.log("📦 Items enviados a CatalogueList:", items);
  }, [items]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (search.trim()) {
      const params = new URLSearchParams();
      params.set("region", search); // siempre "region"
      const url = `${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/catalog?${params.toString()}`;
      console.log("➡️ Fetch catálogo manual con URL:", url);

      setIsLoading(true);
      fetch(url)
        .then(res => {
          console.log("⬅️ Response status (manual):", res.status);
          return res.json();
        })
        .then(data => {
          console.log("⬅️ Response body (manual):", data);
          setItems(data);
        })
        .catch(err => {
          console.error("❌ Error cargando catálogo (manual):", err);
          setItems([]);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Barra de búsqueda + filtro de tipo + botón filtros (solo mobile) */}
      <div className="w-full lg:hidden space-y-3">
        {/* Búsqueda por nombre */}
        <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white">
          <FiSearch className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        {/* Filtro de tipo de maquinaria en móvil */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Maquinaria
          </label>
          <SelectList />
        </div>

        {/* Botón para abrir más filtros */}
        <button
          type="button"
          onClick={() => dispatch(openModal())}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition border border-gray-300"
          aria-label="Abrir más filtros"
        >
          <FiFilter size={18} />
          <span className="font-medium">Más Filtros</span>
        </button>
      </div>

      {/* Sidebar en desktop */}
      <aside className="hidden lg:block lg:w-1/4 shrink-0">
        {/* Búsqueda por nombre en desktop */}
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-[16px] font-bold mb-3">Búsqueda</h3>
          <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white">
            <FiSearch className="text-gray-400 mr-2" size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-sm"
            />
          </div>
        </div>

        {/* Filtros existentes */}
        <FilterComponent ref={filterRef} />
      </aside>

      {/* Catálogo */}
      <div className="catalogue-wrapper w-full lg:w-3/4">
        <Catalogue items={items} searchValue={search} isLoading={isLoading} />
      </div>

      {/* Modal con filtros (mobile) */}
      <Modal>
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Filtros Avanzados</h2>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-2 rounded hover:bg-gray-100 transition"
            aria-label="Cerrar filtros"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Filtros avanzados en mobile */}
        <FilterComponent ref={filterRef} />

        {/* Botón para aplicar filtros y cerrar modal */}
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => dispatch(closeModal())}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 transition font-medium"
          >
            Ver Resultados
          </button>
        </div>
      </Modal>
    </div>
  );
}
