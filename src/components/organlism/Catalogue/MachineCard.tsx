"use client";

import Link from "next/link";
import Image from "next/image";
import { CatalogueItem } from "./types";
import { interestLinks } from "@/constants/routes/frontend";

interface Props {
  data: CatalogueItem;
}

export default function MachineCard({ data }: Props) {
  // Imagen por defecto si no existe
  const imageUrl = data.image?.startsWith("/")
    ? data.image
    : "/images/catalogue/machine5.jpg";

  // Generamos la ruta dinámica con machinetype + id
  const machineType = data.machinetype || "maquinaria";

  const machineCategory = interestLinks.find(item=>item.machine_category === data.machine_category);

  console.log(machineCategory);

  return (
    <Link href={`/catalogo/${machineType}/${data.id}`} passHref>
      <div className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md p-3 w-full max-w-xs flex flex-col justify-between cursor-pointer">
        
        {/* Imagen de la máquina */}
        <div className="relative w-full h-40 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={data.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Información textual */}
        <div className="mt-3">
          <h3 className="text-sm font-medium leading-tight">{data.name}</h3>
          <p className="text-xs font-bold text-black uppercase">
            {data.name.split(" ").pop()}
          </p>
          <p className="text-xs text-gray-500">{data.location}</p>
        </div>

        {/* Precio e icono */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-green-600 font-bold text-sm italic">
            {data.price}$<span className="not-italic">/USD</span>
          </span>
          <Image
            src={machineCategory?.type_icon || "/typemachine/ligera.svg"}
            alt="Icono maquinaria"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
      </div>
    </Link>
  );
}
