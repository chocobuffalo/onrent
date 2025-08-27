"use client";

import AddEnginery from "@/components/atoms/AddEnginery/AddEnginery";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { toggleModal } from "@/libs/redux/features/ui/modalSlicer";


export default function Equipament(){
    const active = useUIAppSelector((state) => state.modal.isOpen);
      const dispatch = useUIAppDispatch();

      const handleAddEnginery = () => {
        dispatch(toggleModal());
      };

    return(
        <div>
        <h1>Gestión de maquinaria</h1>
       <div className="flex justify-between items-center">
                {/* Aquí irá la parte izquierda → lista de maquinarias */}
                <div>
                    {/* Renderiza tus maquinarias aquí */}
                    <h2 className="">Lista de maquinaria</h2>
                </div>

                {/* Botón a la derecha */}
                <AddEnginery active={active} func={handleAddEnginery} />
            </div>
        </div>

        
    )
}