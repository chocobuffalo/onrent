// src/utils/rentPricing/calculateEstimatedRent.ts

export interface RentPricingInput {
    days: number;                // duración total (sin off-by-one)
    qty: number;                 // cantidad de máquinas
    baseDaily: number;           // list_price o price_per_day
    weeklyFactor: number;        // x_onrentx_days_per_week_factor (p.ej. 5.5)
    monthlyFactor: number;       // x_onrentx_days_per_month_factor (p.ej. 23.85)
    weekDiscount?: number;       // x_onrentx_discount_week (0..1)
    monthDiscount?: number;      // x_onrentx_discount_month (0..1)
    minDays?: number;            // x_onrentx_min_rental_days
    includeOperator?: boolean;   // extras.operador
    includeFuel?: boolean;       // extras.combustible
    noOperatorDiscount?: number; // x_onrentx_no_operator_discount (0..1)
    noFuelDiscount?: number;     // x_onrentx_no_fuel_discount (0..1)
  }
  
  export function calculateEstimatedRent(input: RentPricingInput): number {
    const days = Math.max(1, Math.floor(input.days || 1));
    const qty = Math.max(1, Math.floor(input.qty || 1));
  
    const base = Number(input.baseDaily || 0);
  
    // Factores con valores por defecto razonables
    const weeklyFactor = Number.isFinite(input.weeklyFactor) && input.weeklyFactor! > 0 ? Number(input.weeklyFactor) : 5.5;
    const monthlyFactor = Number.isFinite(input.monthlyFactor) && input.monthlyFactor! > 0 ? Number(input.monthlyFactor) : 23.85;
  
    // Normalizar descuentos a [0,1]
    const norm = (v?: number) => {
      const n = Number(v || 0);
      if (!Number.isFinite(n)) return 0;
      return Math.min(1, Math.max(0, n));
    };
    const weekDisc = norm(input.weekDiscount);
    const monthDisc = norm(input.monthDiscount);
    const minDays = Number.isFinite(input.minDays) ? Number(input.minDays) : 0;
  
    const includeOperator = input.includeOperator !== false; // default true
    const includeFuel = input.includeFuel !== false;         // default true
    const noOpDisc = norm(input.noOperatorDiscount);
    const noFuelDisc = norm(input.noFuelDiscount);
  
    let rentPrice = 0;
  
    if (days >= 30) {
      const fullMonths = Math.floor(days / 30);
      const remaining = days % 30;
  
      // Meses completos con descuento mensual
      rentPrice += fullMonths * (base * monthlyFactor * (1 - monthDisc));
  
      // Restante: semanas y días (solo descuento semanal si aplica semanas)
      if (remaining >= 7) {
        const fullWeeks = Math.floor(remaining / 7);
        const extraDays = remaining % 7;
  
        rentPrice += fullWeeks * (base * weeklyFactor * (1 - weekDisc));
        rentPrice += extraDays * base;
      } else {
        rentPrice += remaining * base;
      }
    } else if (days >= 7) {
      const fullWeeks = Math.floor(days / 7);
      const extraDays = days % 7;
  
      rentPrice += fullWeeks * (base * weeklyFactor * (1 - weekDisc));
      rentPrice += extraDays * base;
    } else {
      rentPrice = base * days;
    }
  
    // Mínimo de días solo si el mínimo es > días
    if (minDays > 0 && days < minDays) {
      rentPrice = Math.max(rentPrice, base * minDays);
    }
  
    // Descuentos por excluir operador/combustible (una sola vez)
    if (!includeOperator && noOpDisc > 0) {
      rentPrice *= (1 - noOpDisc);
    }
    if (!includeFuel && noFuelDisc > 0) {
      rentPrice *= (1 - noFuelDisc);
    }
  
    // Aplicar cantidad y asegurar no-negatividad
    rentPrice = Math.max(0, Math.round(rentPrice * qty * 100) / 100);
  
    return rentPrice;
  }
  