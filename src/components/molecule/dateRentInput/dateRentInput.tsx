import DateInput from "@/components/atoms/dateinput/dateinput";
import useDateRange from "@/hooks/frontend/buyProcess/usaDateRange";

export default function DateRentInput() {
    const {startDate,endDate,handleStartDateChange,handleEndDateChange} = useDateRange();

    return (
        <div className="date-rent-input flex flex-col gap-2">
            <h3 className="Arrendamiento text-[16px] font-bold text-center">
                Arrendamiento
            </h3>
            <DateInput placeholder="Inicio" action={handleStartDateChange} value={startDate}/>
            <DateInput placeholder="Fin" value={endDate} action={handleEndDateChange}/>
        </div>
    );
}
