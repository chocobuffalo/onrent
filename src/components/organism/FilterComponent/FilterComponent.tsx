"use client";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import FilterInput from "@/components/atoms/filterInput/filterInput";
import PriceSelector from "@/components/molecule/priceSelector/priceSelector";
import SelectList from "@/components/atoms/selectList/selectList";
import DateRentInput from "@/components/molecule/dateRentInput/dateRentInput";
import SearchButton from "@/components/atoms/SearchButton/SearchButton";
import useSendAction from "@/hooks/frontend/buyProcess/useSendAction";

export type FilterComponentHandle = {
  /**
   * Llama al mismo handlerSubmit que usa el formulario.
   * Se puede pasar opcionalmente un `search` (cadena) para que quede disponible
   * como input oculto dentro del formulario (útil si tu handler lee campos del DOM).
   */
  submit: (search?: string) => void;
};

type Props = {
  initialSearch?: string;
};

const FilterComponent = forwardRef<FilterComponentHandle, Props>(({ initialSearch }, ref) => {
  const { handlerSubmit } = useSendAction();
  // valor que podemos inyectar desde móvil antes de llamar a handlerSubmit
  const [mobileSearch, setMobileSearch] = useState(initialSearch ?? "");

  useImperativeHandle(
    ref,
    () => ({
      submit: (search?: string) => {
        // si nos pasan search lo guardamos en estado (y en el input hidden)
        if (typeof search === "string") {
          setMobileSearch(search);
        }
        // llamamos al mismo handler que usa el botón Buscar dentro del form
        handlerSubmit();
      },
    }),
    [handlerSubmit]
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("➡️ Ejecutando handlerSubmit con mobileSearch:", mobileSearch);
        handlerSubmit();
      }}
      className="filter-component flex flex-col gap-4.5 "
    >
      {/* Input oculto con el valor de búsqueda móvil (por si tu handler lee inputs del DOM) */}
      <input type="hidden" name="mobileSearch" value={mobileSearch} />

      <div className="rounded-[5px] flex flex-col gap-3.5 border-[#B2B2B2] border-1 p-4">
        <div className="flex flex-col gap-2 ">
          <h3 className="text-[16px] font-bold text-left">Ubicación</h3>
          <FilterInput checkpersist={true} />
        </div>

        <div className="flex flex-col gap-2 ">
          <h3 className="text-[16px] font-bold text-left">Categoria</h3>
          <SelectList />
        </div>

        <PriceSelector />
        <SearchButton />
      </div>

      <div className="rounded-[5px] border-[#B2B2B2] border-1 p-4 flex flex-col gap-3.5">
        <h3 className="Arrendamiento text-[16px] font-bold text-center">
          Tiempo de Arrendamiento
        </h3>
    {/* AGREGAR showProjectSection={false} --Se crea porque se pidio que desde la página de catalogo no se debe ver el componente de crear proyecto*/}
     <DateRentInput showProjectSection={false} />
      </div>
    </form>
  );
});

FilterComponent.displayName = "FilterComponent";
export default FilterComponent;