"use client";

import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { formatDate } from "@/utils/formatDate";
import DateIcon from "../customIcons/dateIcon";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/material_orange.css";
import "./dateinput.scss";

export default function DateInput({
  placeholder = "Fecha de inicio",
  value,
  action,
  startDate,
  endDate,
  minDate
}: {
  endDate?: { month: number; day: number; year: number } | boolean;
  startDate?: { month: number; day: number; year: number } | boolean;
  placeholder?: string;
  value: string;
  action: (arg: string) => void;
  minDate?: Date;
}) {
  
  let calculatedMinDate: Date | string | undefined;
  
  if (minDate instanceof Date) {
    calculatedMinDate = minDate;
  } else if (typeof startDate === "object" && startDate) {
    calculatedMinDate = new Date(
      startDate.year,
      startDate.month - 1,
      startDate.day
    );
  } else {
    calculatedMinDate = undefined;
  }

  let calculatedMaxDate: Date | undefined = undefined;
  
  if (typeof endDate === "object" && endDate && endDate.year && endDate.month && endDate.day) {
    calculatedMaxDate = new Date(endDate.year, endDate.month - 1, endDate.day);
  }

  return (
    <div className="dateInput relative">
      <Flatpickr
        value={value}
        className="border dateItem h-[40px] border-[#B2B2B2] rounded-[5px] block px-3 py-6 w-full relative z-10"
        options={{
          minDate: calculatedMinDate,
          maxDate: calculatedMaxDate, //Solo se establece si hay un objeto válido
          locale: Spanish,
          dateFormat: "d-m-Y",
          disableMobile: true,
          clickOpens: true,
          //NO agregar "disable" ni "enable" que limiten fechas
        }}
        onChange={(date) => {
          if (date.length > 0) {
            action(formatDate(new Date(date[0]).toISOString()));
          } else {
            action("");
          }
        }}
      />
      <span className="absolute right-3 top-4">
        <DateIcon />
      </span>
      <label className="text-[10px] absolute left-2 bottom-1 text-secondary">
        {placeholder}
      </label>
    </div>
  );
}
