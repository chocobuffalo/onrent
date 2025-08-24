"use client";

import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { formatDate } from "@/utils/formatDate";
import DateIcon from "../customIcons/dateIcon";
import "flatpickr/dist/flatpickr.min.css"; // CSS base REQUERIDO
import "flatpickr/dist/themes/material_orange.css"; // Tema opcional
import "./dateinput.scss";

export default function DateInput({
  placeholder = "Fecha de inicio",
  value,
  action,
  startDate,
  endDate
}: {
  endDate?: { month:number, day:number, year:number }| boolean;
  startDate?: { month:number, day:number, year:number }| boolean;
  placeholder?: string;
  value: string;
  action: (arg: string) => void;
}) {
  const minDate = typeof startDate === "object"
      ? new Date(startDate.year, startDate.month -1 , startDate.day)
      : "today";

     // console.log( typeof startDate === "object", startDate);

  const maxDate = typeof endDate === "object"
      ? new Date(endDate.year, endDate.month -1 , endDate.day)
      : undefined;


  return (
    <div className="dateInput relative">
      <Flatpickr
        value={value}
        className="border dateItem h-[40px] border-[#B2B2B2] rounded-[5px] block px-3 py-6 w-full relative z-10"
        options={{
          minDate: minDate,
          maxDate: maxDate,
          locale: Spanish,
          dateFormat: "d-m-Y",
          disableMobile: true, // Previene el datepicker nativo en móviles
          clickOpens: true, // Asegura que se abra al hacer click
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