/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SelectInterface } from "@/types/iu";
import "./selectInput.scss";
export default function SelectInput({
  options,
  name,
  register,
  label,
  placeHolder,
  errors,
}: {
  errors: any;
  name: string;
  options: SelectInterface[];
  register: any;
  value?: SelectInterface;
  label: string;
  placeHolder?: string;
}) {
  return (
    <div className="form-group relative">
      <label htmlFor={name}>{label}</label>
      <div className="relative select-container">
        <select className="form-control mb-1" {...register(name)}>
          {placeHolder && <option value="">{placeHolder}</option>}
          {options.map((option) => (
            <option key={option.value}>{option.label}</option>
          ))}
        </select>
        <div className="absolute right-0 top-0 pt-3 px-3" aria-hidden="true">
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
            className="css-8mmkcg"
          >
            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
          </svg>
        </div>
      </div>

      {errors[name] && (
        <span className="text-danger">{errors[name].message}</span>
      )}
    </div>
  );
}
