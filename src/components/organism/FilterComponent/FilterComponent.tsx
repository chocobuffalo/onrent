"use client";
import FilterInput from "@/components/atoms/filterInput/filterInput";
import PriceSelector from "@/components/molecule/priceSelector/priceSelector";
import SelectList from "@/components/atoms/selectList/selectList";
import DateRentInput from "@/components/molecule/dateRentInput/dateRentInput";
import SearchButton from "@/components/atoms/SearchButton/SearchButton";
import useSendAction from "@/hooks/frontend/buyProcess/useSendAction";

export default function FilterComponent() {
  const { handlerSubmit } = useSendAction();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handlerSubmit();
      }}
      className="filter-component flex flex-col gap-4.5 "
    >
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
        <DateRentInput />
      </div>
    </form>
  );
}
