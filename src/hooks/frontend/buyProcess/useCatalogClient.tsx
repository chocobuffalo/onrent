"use client";

import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/libs/redux/features/ui/modalSlicer";
import Modal from "@/components/molecule/Modal/modal";
import FilterComponent from "@/components/organism/FilterComponent/FilterComponent";
import Catalogue from "@/components/organism/Catalogue/CatalogueContainer";
import { FiFilter, FiX } from "react-icons/fi";

export default function CatalogClient({ slug }: { slug?: string }) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Botón abrir modal (solo mobile) */}
      <div className="w-full lg:hidden">
        <button
          onClick={() => dispatch(openModal())}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition w-full border border-gray-300"
        >
          <FiFilter size={18} />
          <span className="font-medium">Filtrar</span>
        </button>
      </div>

      {/* Sidebar en desktop */}
      <aside className="hidden lg:block lg:w-1/4 shrink-0">
        <FilterComponent />
      </aside>

      {/* Catálogo */}
      <div className="catalogue-wrapper w-full lg:w-3/4">
        <Catalogue slug={slug} />
      </div>

      {/* Modal con filtros (mobile) */}
      <Modal>
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={() => dispatch(closeModal())}
            className="p-2 rounded hover:bg-gray-100 transition"
          >
            <FiX size={20} />
          </button>
        </div>
        <FilterComponent />
      </Modal>
    </div>
  );
}
