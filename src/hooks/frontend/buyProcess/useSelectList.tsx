'use client';

import { setType } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { SelectInterface } from "@/types/iu";
import { use, useEffect, useState } from "react";



export default function useSelectList() {
    // Aquí puedes implementar la lógica para el componente SelectList
    const filterStateType =  useUIAppSelector((state) => state.filters.type);
     const dispatch = useUIAppDispatch()
     const [selectedType, setSelectedType] = useState<SelectInterface[]>([]);
    useEffect(() => {
        // Lógica de inicialización o efectos secundarios si es necesario
        console.log("SelectList hook initialized");
        
        // Puedes agregar lógica adicional aquí si es necesario
        console.log("Selected type:", filterStateType);

    }, [ ]);

    return {
        filterStateType,
        dispatch
    };

}
