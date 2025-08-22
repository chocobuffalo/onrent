import { currency } from "@/constants";

interface PricingSectionProps {
  unitPrice: number;
  price: number;
  count: number;
  totalPrice: number;
}

export default function PricingSection({
  unitPrice,
  price,
  count,
  totalPrice
}: PricingSectionProps) {
  return (
    <>
      {/* Precio por unidad */}
      <div className="py-5 flex justify-between w-full border-b border-[#bbb]">
        <p className="text-black">Precio unidad:</p>
        <p className="text-red-500 text-sm">
          <span className="font-bold">
            {unitPrice.toLocaleString('es-ES')} {currency.code}/Día
          </span>
        </p>
      </div>

      {/* Precio por cantidad de máquinas */}
      <div className="py-5 flex justify-between w-full border-b border-[#bbb]">
        <p className="text-black">Precio por {count} máquinas:</p>
        <p className="text-red-500 text-sm">
          <span className="font-bold">
            {price.toLocaleString('es-ES')} {currency.code}/Día
          </span>
        </p>
      </div>

      {/* Precio total */}
      <div className="py-5 flex justify-between w-full border-b border-[#bbb]">
        <p className="text-black">Precio total:</p>
        <p className="text-green-600 font-bold text-base">
          {totalPrice.toLocaleString('es-ES')} {currency.code}
        </p>
      </div>
    </>
  );
}
