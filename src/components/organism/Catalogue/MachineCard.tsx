"use client";

import Link from "next/link";
import Image from "next/image";
import { CatalogueItem } from "./types";
import { interestLinks } from "@/constants/routes/frontend";
import { currency } from "@/constants";
import { getImageUrl } from "@/utils/imageUrl";

interface Props {
  data: CatalogueItem;
}

export default function MachineCard({ data }: Props) {
  const imageUrl = data.image
    ? getImageUrl(data.image)
    : "/images/catalogue/machine5.jpg";

  const machineType = data.machinetype || "maquinaria";

  const machineCategory = interestLinks.find(
    (item) => item.machine_category === data.machine_category
  );

  return (
    <Link href={`/${data.id}`} passHref>
      <div className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md p-3 w-full max-w-xs flex flex-col justify-between cursor-pointer">

        <div className="relative w-full h-40 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={data.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-medium leading-tight">{data.name}</h3>
          <p className="text-xs font-bold text-black uppercase">
            {data.name.split(" ").pop()}
          </p>
          <p className="text-xs text-gray-500">{data.location}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-green-600 font-bold text-sm italic">
            {data.price}$<span className="not-italic">/{currency.code}</span>
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
