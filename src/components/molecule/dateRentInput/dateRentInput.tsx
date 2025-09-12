import DateInput from "@/components/atoms/dateinput/dateinput";
import useDateRange from "@/hooks/frontend/buyProcess/usaDateRange";
import { useRouter, useParams } from "next/navigation";
import { fixDate } from "@/utils/compareDate";
import { redirect } from "next/navigation";

export default function DateRentInput({grid}:{grid?:boolean}) {
    const router = useRouter();
const params = useParams();

const handleCreateProject = () => {
    const machineId = params.id;
    const machinetype = 'maquinaria';
    
    router.push(`/nuevo-proyecto?machineId=${machineId}&machinetype=${machinetype}`);
};
    const {startDate,endDate,handleStartDateChange,handleEndDateChange,needProject} = useDateRange();

    return (
        <div className="date-container w-full flex flex-col gap-3.5 items-end">

            <div className={`date-rent-input grid w-full  ${grid ? "md:grid-cols-2" : "md:grid-cols-1"} gap-2`}>
            
                <DateInput 
                    placeholder="Inicio" 
                    action={handleStartDateChange} 
                    value={startDate}
                    endDate={ typeof fixDate(endDate) === "object" ? fixDate(endDate) : undefined } 
                    />
                
                <DateInput 
                    placeholder="Fin" 
                    startDate={ typeof fixDate(startDate) === "object" ? fixDate(startDate) : undefined } 
                    value={endDate} 
                    action={handleEndDateChange}
                />
            
            </div>
           {needProject &&( <div className={`w-full gap-3.5 flex ${grid ? "flex-col lg:flex-row" : "lg:flex flex-col"} lg:items-center`}>
                <p className="date-info text-secondary  block w-full m-0">
                    * La fecha de arrendamiento es mayor a un dia, por este motivo debe crear un proyecto
                </p>
                <button onClick={handleCreateProject} className={`bg-secondary border-secondary border-1 duration-300 text-white cursor-pointer hover:bg-transparent hover:text-secondary  ${grid ? "lg:max-w-[160px] w-full" : "lg:w-full"} block float-end hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm`}>

                   <div className="">Crear Proyecto</div>
                </button>
            </div>)}
        </div>
    );
}
