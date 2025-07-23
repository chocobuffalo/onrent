'use client';

import { setType } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { SelectInterface } from "@/types/iu";
import { storage } from "@/utils/storage";
import { use, useEffect, useState } from "react";



export default function useSelectList() {
    // Aquí puedes implementar la lógica para el componente SelectList
    const filterStateType =  useUIAppSelector((state) => state.filters.type);
     const dispatch = useUIAppDispatch()
     const [selectedType, setSelectedType] = useState<SelectInterface[]>(filterStateType||[]);
    

    return {
        filterStateType,
        selectedType,
        setSelectedType,
        dispatch
    };

}
