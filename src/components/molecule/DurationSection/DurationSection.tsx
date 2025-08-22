import { shortDate } from "@/utils/compareDate";
import { ReactNode } from "react";

interface DurationSectionProps {
  dayLength: number;
  startDate: string | null;
  endDate: string | null;
  open: boolean;
  onToggleOpen: () => void;
  DateRentInput: ReactNode;
}

export default function DurationSection({
  dayLength,
  startDate,
  endDate,
  open,
  onToggleOpen,
  DateRentInput
}: DurationSectionProps) {
  return (
    <div className="py-5 flex flex-col gap-3.5 w-full border-b border-[#bbb]">
      <div className="flex justify-between w-full items-center">
        <div>
          <p className="text-md">
            Duración: {dayLength} {dayLength === 1 ? 'día' : 'días'}
          </p>
          <p className="text-sm text-gray-600">
            {startDate && endDate
              ? `Desde el ${shortDate(startDate)} al ${shortDate(endDate)}`
              : "Selecciona fechas"
            }
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleOpen}
          className="py-2 px-4 bg-[#bbb]"
        >
          Cambiar fecha
        </button>
      </div>
      {open && DateRentInput}
    </div>
  );
}
