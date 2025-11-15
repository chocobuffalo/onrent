// src/components/organism/Catalogue/MachineCard.tsx
import Link from "next/link";
import Image from "next/image";
import { CatalogueItem } from "./types";
import { interestLinks } from "@/constants/routes/frontend";
import { currency } from "@/constants";
import { getImageUrl } from "@/utils/imageUrl";

interface Props {
  data: CatalogueItem;
  selectionMode?: boolean;
  onSelect?: (machine: CatalogueItem) => void;
}

export default function MachineCard({ 
  data, 
  selectionMode = false,
  onSelect 
}: Props) {
  const imageUrl = data.image
    ? getImageUrl(data.image)
    : "/images/catalogue/machine5.jpg";

  const machineType = data.machinetype || "maquinaria";

  const machineCategory = interestLinks.find(
    (item) => item.machine_category === data.machine_category
  );

  const handleSelect = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation(); 
  if (onSelect) {
    onSelect(data);
  }
};

  const cardContent = (
    <div className="rounded-xl border border-gray-200 h-[100%] shadow-sm hover:shadow-md p-3 w-full flex flex-col justify-between cursor-pointer">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={data.name}
          width={500}
          height={300}
          className="object-cover w-full object-center"
          sizes="(max-width: 768px) 100vw, 20vw"
          unoptimized
          priority
        />
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-medium leading-tight">{data.name}</h3>
        <p className="text-xs font-bold text-black uppercase">
          {data.name.split(" ").pop()}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-green-600 font-bold text-sm italic">
        {data.list_price.toLocaleString("es-MX")} <span className="not-italic">{currency.code}</span>
        </span>
        <Image
          src={machineCategory?.type_icon || "/typemachine/ligera.svg"}
          alt="Icono maquinaria"
          width={24}
          height={24}
          className="object-contain"
        />
      </div>

      {/* Botón Seleccionar - Solo visible en modo selección */}
      {selectionMode && (
        <button
          onClick={handleSelect}
          className="mt-3 w-full bg-secondary text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition font-semibold text-sm"
        >
          Seleccionar
        </button>
      )}
    </div>
  );

  // Si está en modo selección, devuelve div clickeable
  if (selectionMode) {
    return (
      <div className="w-full" onClick={handleSelect}>
        {cardContent}
      </div>
    );
  }

  // Modo normal: devuelve Link
  return (
    <Link
      href={`/${data.id}?region=${encodeURIComponent(data.location ?? "")}`}
      passHref
      className="w-full"
    >
      {cardContent}
    </Link>
  );
}