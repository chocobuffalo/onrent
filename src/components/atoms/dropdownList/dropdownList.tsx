'use client';

import { ImSpinner8 } from "react-icons/im";
import './dropdownList.scss';

export default function DropdownList({options, open, handlerChange, isLoading}:{options:{label:string,value:string}[], open:boolean, handlerChange:(value:string)=>void, isLoading:boolean}){
    return(
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
                    handlerChange(option.label);
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
    )
}