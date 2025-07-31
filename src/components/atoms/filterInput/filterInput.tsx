'use client';


import useAutoComplete from "@/hooks/frontend/buyProcess/useAutoComplete";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import './filterInput.scss';


export default function FilterInput({checkpersist}: {checkpersist?: boolean}) {
    const {inputValue,setInputValue,options,debouncedFilterColors,handlerChange,handlerFocus,handlerInputChange,open,setOpen} = useAutoComplete(checkpersist);
    
    
    return (
        <div className="search-input relative w-full" >
          <div className="input-item flex items-center gap-2 bg-white border border-gray-300 rounded-md px-2">
            <FaMapMarkerAlt className="text-black" />
              <input
                onFocus={() => handlerFocus(inputValue)}
                type="text"
                value={inputValue}
                name="location"
                onChange={(e) =>{handlerInputChange(e.target.value)}}
                placeholder="Indica tu ubicación"
                className="italic rounded-md p-2 w-full focus-visible:outline-none focus:border-secondary focus:ring-0"

            />
          </div>
        <ul className={`listen-items border-gray-300 absolute z-10 bg-white border rounded-md w-full max-h-60 overflow-y-auto shadow-lg mt-2 ${open ? 'block' : 'hidden'}`}>
            {
                options.length > 0 ? options.map((option) => (
                    <li key={option.value} className="list-item">
                        <button className="w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors hover:bg-gray-200 text-left" onClick={() => { handlerChange(option.value); setInputValue(option.label); setOpen(false)  }}>{option.label}</button>
                    </li>
                )):(<li className="list-item w-full py-3.5 px-1.5  cursor-pointer duration-300 transition-colors">
                    <ImSpinner8 color="#ea6300" size={20} className="animate-spin mx-auto" />
                </li>)
            }
        </ul>
        </div>
    );
}
