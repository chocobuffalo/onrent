
import FilterInput from "@/components/atoms/filterInput/filterInput";
import PriceSelector from "@/components/atoms/priceSelector/priceSelector";
import SelectList from "@/components/atoms/selectList/selectList";

export default function FilterComponent() {
    return(
        <div className="filter-component flex flex-col gap-3.5 ">
            {/* Aquí puedes agregar los filtros necesarios */}
            <div className="rounded-[5px] flex flex-col gap-2 border-[#B2B2B2] border-1 p-4">
                <FilterInput checkpersist={true} />
                <SelectList/>
                <PriceSelector/>
                
            </div>
            <div className="rounded-[5px] border-[#B2B2B2] border-1 p-4">
                
            </div>
        </div>
    )
}