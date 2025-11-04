import React, { useMemo } from "react";
import { calculateEstimatedRent } from "@/utils/rentPricing/calculateEstimatedRent";
import { countDays } from "@/utils/compareDate";

interface BookingItem {
  machineName?: string;
  unitPrice: number;
  quantity: number;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  dayLength?: number;
  requires_operator: boolean;
  requires_fuel: boolean;
  pricing?: {
    days_per_week_factor?: number;
    days_per_month_factor?: number;
    discount_week?: number;
    discount_month?: number;
    min_days?: number;
    no_operator_discount?: number;
    no_fuel_discount?: number;
  };
}

interface Props {
  bookingItems: BookingItem[];
}

export default function GlobalDiscountSummary({ bookingItems }: Props) {
  const { estimatedTotal, ahorro } = useMemo(() => {
    let subtotal = 0;
    let total = 0;

    bookingItems.forEach((item) => {
      const days =
        item.dayLength ??
        countDays(
          typeof item.startDate === "string"
            ? item.startDate
            : new Date(item.startDate as Date).toISOString(),
          typeof item.endDate === "string"
            ? item.endDate
            : new Date(item.endDate as Date).toISOString()
        );

      const lineSubtotal = item.unitPrice * item.quantity * days;

      const lineTotal = calculateEstimatedRent({
        days,
        qty: item.quantity,
        baseDaily: item.unitPrice,
        weeklyFactor: item.pricing?.days_per_week_factor ?? 0,
        monthlyFactor: item.pricing?.days_per_month_factor ?? 0,
        weekDiscount: item.pricing?.discount_week ?? 0,
        monthDiscount: item.pricing?.discount_month ?? 0,
        minDays: item.pricing?.min_days ?? 0,
        includeOperator: item.requires_operator,
        includeFuel: item.requires_fuel,
        noOperatorDiscount: item.pricing?.no_operator_discount ?? 0,
        noFuelDiscount: item.pricing?.no_fuel_discount ?? 0,
      });

      subtotal += lineSubtotal;
      total += lineTotal;
    });

    return {
      estimatedTotal: total,
      ahorro: subtotal - total,
    };
  }, [bookingItems]);

  if (!bookingItems || bookingItems.length === 0) return null;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-base font-semibold mb-2">Beneficios de tu renta</h3>

      {ahorro > 0 && (
        <div className="flex justify-between text-sm text-green-600 mb-2">
          <span>Descuento por duración</span>
          <span>
            -{" "}
            {ahorro.toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            MXN
          </span>
        </div>
      )}

      {/* Total estimado destacado en verde */}
      <div className="pt-3 border-t border-gray-300 flex justify-between items-center">
        <p className="font-semibold text-gray-900">Total estimado:</p>
        <p className="text-lg font-bold text-green-600">
          {estimatedTotal.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          MXN
        </p>
      </div>
    </div>
  );
}
