import { currency } from "@/constants";

export default function PriceDetail({price}:{price:number}) {
  return (
    <div className="p-3 mt-4  border-1 border-[#bbbb] rounded-sm">
      <p className="text-green-700 font-bold text-lg italic ">{price} {currency.code}/Día</p>
      <p className="text-xs text-gray-600 underline">Revisa nuestras políticas de cancelación </p>
    </div>
  );
}
