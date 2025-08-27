import useLocation from "@/hooks/frontend/buyProcess/useLocation";

import { FaMapMarkerAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

export default function LocationInput({registerFunc, name, inputClass}:{name:string,registerFunc:any, inputClass?:string}){
    const {isLoading, open,options,inputValue,handlerInputChange, setInputValue,setOpen,handlerFocus,handlerChange} = useLocation();
    const inputClasses = inputClass ? `${inputClass} input-item flex items-center gap-2` : "input-item flex items-center gap-2 bg-white border border-gray-300 rounded-md px-2";

 return(
    <div className="search-input relative w-full">
      <div className={inputClasses}>
        
        <input
          onFocus={() => handlerFocus(inputValue)}
          type="text"
          name={name}
          value={inputValue}
          onChange={(e) => {
            console.log(e);
            handlerInputChange(e.target.value);
            registerFunc(e.target.value)
          }}
          placeholder="Indica tu ubicación"
          className="italic rounded-md p-2 w-full focus-visible:outline-none focus:border-secondary focus:ring-0"
        />
      </div>
      
      <ul
        className={`listen-items border-gray-300 absolute z-10 bg-white border rounded-md w-full max-h-60 overflow-y-auto shadow-lg mt-2 ${
          open ? "block" : "hidden"
        }`}
      >

        {
        options.length  > 0 ? (
          options.map((option) => (
            <li key={option.value} className="list-item">
              <button
                type="button"
                className="w-full py-3.5 px-1.5 cursor-pointer duration-300 transition-colors hover:bg-gray-200 text-left"
                onClick={() => {
                  handlerChange(option.value);
                  setInputValue(option.label);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))
        ) : (
          <li className="list-item w-full py-3.5 px-1.5  cursor-pointer duration-300 transition-colors">
            {isLoading ? (
              <ImSpinner8 color="#ea6300" size={20} className="animate-spin mx-auto" />
            ) : (
              <span>No hay resultados</span>
            )}
          </li>
        )}
      </ul>
    </div>
 )   
}