'use client';

import { useEffect, useState } from "react";
import useAutoComplete from "@/hooks/frontend/buyProcess/useAutoComplete";
import { FaMapMarkerAlt } from "react-icons/fa";
import './filterInput.scss';
import { setFilters } from "@/libs/redux/features/ui/filterSlicer";


export default function FilterInput({checkpersist}: {checkpersist?: boolean}) {
    const {inputValue,setInputValue,options,debouncedFilterColors,handlerChange,uiSelector,dispatch} = useAutoComplete();
    const [open, setOpen] = useState(false);

    const handlerFocus=(text:string)=>{
        debouncedFilterColors(text)
        setOpen(true);
    }
    useEffect(()=>{
        if(checkpersist){
            const persistedInput = localStorage.getItem('filters');
            if (persistedInput) {
                const parsedInput = JSON.parse(persistedInput);
                dispatch(setFilters(parsedInput));
                handlerInputChange(parsedInput.location.label || '');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const handlerInputChange =(text:string)=>{
        debouncedFilterColors(text)
        setInputValue(text)
    }
    console.log(inputValue, options);
    return (
        <div className="search-input relative w-full" >
          <div className="input-item flex items-center gap-2 bg-white border border-gray-300 rounded-md px-2">
            <FaMapMarkerAlt className="text-black" />
              <input
                onFocus={() => handlerFocus(inputValue)}
                type="text"
                value={inputValue}
                onChange={(e) =>{handlerInputChange(e.target.value)}}
                placeholder="Buscar..."
                className="italic rounded-md p-2 w-full focus-visible:outline-none focus:border-secondary focus:ring-0"

            />
          </div>
        <ul className={`listen-items border-gray-300 absolute z-10 bg-white border rounded-md w-full max-h-60 overflow-y-auto shadow-lg mt-2 ${open ? 'block' : 'hidden'}`}>
            {
                options.map((option) => (
                    <li key={option.value} className="list-item">
                        <button className="w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors hover:bg-gray-200 text-left" onClick={() => { handlerChange(option.value); setInputValue(option.label); setOpen(false)  }}>{option.label}</button>
                    </li>
                ))
            }
        </ul>
        </div>
    );
}
