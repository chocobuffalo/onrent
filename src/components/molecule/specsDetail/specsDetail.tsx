import { SpecsInterface } from "@/types/machinary";
import Image from "next/image";

export default function SpecsDetail({specsMachinary}:{specsMachinary:SpecsInterface}){
    const {  type,
        category,
        motor,
        fuel,
        weight_tn,
        height_m,
        width_m,
        seats } = specsMachinary
    return(
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3 mt-4">
            { weight_tn && 
                <div className="py-3 flex items-center justify-start gap-3 ">
                    <Image src="/icons/specs/weight.svg" alt="Weight" width={30} height={30} className="w-[44px]"/>  
                    <p>Peso: {weight_tn} Ton</p>
                </div> 
            }
            {
                motor && 
                <div className="py-3 flex items-center justify-start gap-3 ">
                    <Image src="/icons/specs/motor.svg" alt="Motor" width={30} height={30} className="w-[44px]"/>  
                    <p>Motor: {motor} HP</p>
                </div>
            }
            {
                height_m && 
                <div className="py-3 flex items-center justify-start gap-3 ">
                    <Image src="/icons/specs/height.svg" alt="Height" width={30} height={30} className="w-[44px]"/>  
                    <p>Alto: {height_m} Metros</p>
                </div>
            }

            {
                fuel && 
                <div className="py-3 flex items-center justify-start gap-3 ">
                    <Image src="/icons/specs/fuel.svg" alt="Combustible" width={30} height={30} className="w-[44px]"/>  
                    <p>Combustible: {fuel}</p>
                </div>
            }
            {
                width_m && 
                <div className="py-3 flex items-center justify-start gap-3 ">
                    <Image src="/icons/specs/width.svg" alt="Ancho" width={30} height={30} className="w-[44px]"/>  
                    <p>Ancho: {width_m} Metros</p>
                </div>
            }
            {/* ✅ Convertir seats a número y validar si es mayor a 0 */}
            {
                (seats != null && Number(seats) > 0) && 
                <div className="py-3 flex items-center justify-start gap-3 ">
                    <Image src="/icons/specs/seat.svg" alt="Asientos" width={30} height={30} className="w-[44px]"/>  
                    <p>Asientos: {seats}</p>
                </div>
            }
          </div>
    )
}
