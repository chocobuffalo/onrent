'use client';

import MachineCard from "./MachineCard";
import { CatalogueItem } from "./types";

interface Props {
  items?: CatalogueItem[];
  selectionMode?: boolean;
  onSelectMachine?: (machine: CatalogueItem) => void;
  isLoading?: boolean;
}

export default function CatalogueList({
  items = [],
  selectionMode = false,
  onSelectMachine,
  isLoading = false
}: Props) {
  console.log("📦 Items recibidos en CatalogueList:", items);

  if (!Array.isArray(items)) {
    console.warn("⚠️ Items no es un array, valor recibido:", items);
    return <div>Catálogo vacío o error en datos</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="text-center text-gray-500 py-6">No hay productos disponibles</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
      {items.map((item) => (
        <MachineCard
          key={item.id}
          data={item}
          selectionMode={selectionMode}
          onSelect={onSelectMachine}
        />
      ))}
    </div>
  );
}
