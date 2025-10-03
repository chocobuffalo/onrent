// src/components/organism/Catalogue/CatalogueList.tsx
import MachineCard from "./MachineCard";
import { CatalogueItem } from "./types";

interface Props {
  items: CatalogueItem[];
  selectionMode?: boolean;
  onSelectMachine?: (machine: any) => void;
}

export default function CatalogueList({ 
  items, 
  selectionMode = false,
  onSelectMachine 
}: Props) {
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