
import { Metadata } from "next";
import MachineTable from "@/components/organism/MachineTable/MachineTable"

export const metadata: Metadata = {
  title: 'Equipamiento',
  description: 'Gestiona tu inventario',
}

export default function Equipament() {

    return (
    <div>
 <MachineTable /> 
    </div>
    )
   
}