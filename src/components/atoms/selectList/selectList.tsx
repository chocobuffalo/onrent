'use client';
import { typeOptions } from "@/constants/routes/home";
import useSelectList from "@/hooks/frontend/buyProcess/useSelectList";
import { setType } from "@/libs/redux/features/ui/filterSlicer";
import { storage } from "@/utils/storage";
import { useEffect, useState } from "react";
import Select from 'react-select';
export default function SelectList() {
    const {  filterStateType,
        selectedType,
        setSelectedType,
        dispatch } = useSelectList();
        const [options, setOptions] = useState(filterStateType || []);

    useEffect(() => {
        const storedType = storage.getItem('filters')?.type;
        setTimeout(() => {
            if (storedType) {
                console.log(storedType);
               setOptions(storedType);
                setSelectedType(storedType);
                dispatch(setType(storedType));
            } else {
                setSelectedType([]);
                dispatch(setType([]));
            }
        }, 300);
    }, []);

    const handlerChange = (value:any) =>{
        setSelectedType(value);
        dispatch(setType(value));
        storage.setItem('filters', { ...storage.getItem('filters'), type: value });
        console.log("Selected types:", value);
    }
    return(
        <Select 
        defaultValue={options}
        value={selectedType}
        isMulti
        name="colors"
        options={typeOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={(newValue)=>handlerChange(newValue)}
         />
    )
}