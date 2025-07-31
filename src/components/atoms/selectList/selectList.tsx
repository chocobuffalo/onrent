'use client';
import { typeOptions } from "@/constants/routes/home";
import useSelectList from "@/hooks/frontend/buyProcess/useSelectList";
import Select from 'react-select';
export default function SelectList() {
    const {  filterStateType, selectedType, handlerChange } = useSelectList();
    
    return(
        <Select 
        defaultValue={filterStateType}
        value={selectedType}
        name="category_machine"
        options={typeOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={(newValue)=>handlerChange(newValue)}
         />
    )
}