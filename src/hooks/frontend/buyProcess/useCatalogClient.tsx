"use client";

import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/libs/redux/features/ui/modalSlicer";
import Modal from "@/components/molecule/Modal/modal";
import FilterComponent, { FilterComponentHandle } from "@/components/organism/FilterComponent/FilterComponent";
import Catalogue from "@/components/organism/Catalogue/CatalogueContainer";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";

export default function CatalogClient({ slug }: { slug?: string }) {
  const dispatch = useDispatch();
  const filterRef = useRef<FilterComponentHandle | null>(null);
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Llamamos al submit expuesto por FilterComponent.
    // Le pasamos la búsqueda para que quede disponible dentro del form (input hidden).
    if (filterRef.current?.submit) {
      filterRef.current.submit(search);
    } else {
      // fallback: si por alguna razón no está la referencia, abrimos filtros
      dispatch(openModal());
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Barra de búsqueda + botón filtros (solo mobile) */}
      <div className="w-full lg:hidden">
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
          <div className="flex items-center flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white">
            <FiSearch className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-sm"
            />
          </div>

          <button
            type="button"
            onClick={() => dispatch(openModal())}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition border border-gray-300"
            aria-label="Abrir filtros"
          >
            <FiFilter size={18} />
            <span className="font-medium">Filtros</span>
          </button>
        </form>
      </div>

      {/* Sidebar en desktop */}
      <aside className="hidden lg:block lg:w-1/4 shrink-0">
        <FilterComponent />
      </aside>

      {/* Catálogo */}
      <div className="catalogue-wrapper w-full lg:w-3/4">
        <Catalogue slug={slug} />
      </div>

      {/* Modal con filtros (mobile) -> aquí dejamos el FilterComponent con ref */}
      <Modal>
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-2 rounded hover:bg-gray-100 transition"
            aria-label="Cerrar filtros"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* instacia usada en mobile (referenciada por filterRef) */}
        <FilterComponent ref={filterRef} />
      </Modal>
    </div>
  );
}
