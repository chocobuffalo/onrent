export default function PriceDetail({
  price,
  discountWeek,
  discountMonth
}: {
  price: number;
  discountWeek?: number;
  discountMonth?: number;
}) {
  return (
    <div className="p-3 mt-4 border-1 border-[#bbbb] rounded-sm">
      <p className="text-green-700 font-bold text-lg italic">
        {price} USD/Día
      </p>

      {discountWeek !== undefined && (
        <p className="text-sm text-green-600">
          -{discountWeek}% por semana
        </p>
      )}

      {discountMonth !== undefined && (
        <p className="text-sm text-green-600">
          -{discountMonth}% por mes
        </p>
      )}

      <p className="text-xs text-gray-600 underline">
        Cancelación sin costo en cualquier momento
      </p>
    </div>
  );
}
