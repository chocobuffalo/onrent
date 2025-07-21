'use client';
import { typeOptions } from "@/constants/routes/home";
import useSelectList from "@/hooks/frontend/buyProcess/useSelectList";
import Select from 'react-select';
export default function SelectList() {
    const { filterStateType, dispatch } = useSelectList();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        // Dispatch an action or update state based on the selected value
        console.log("Selected value:", selectedValue);
    };

    console.log(filterStateType);

    return(
        <Select 
        defaultValue={filterStateType}
    isMulti
    name="colors"
    options={typeOptions}
    className="basic-multi-select"
    classNamePrefix="select"
         />
    )
}