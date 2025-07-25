'use client';
import "flatpickr/dist/themes/material_orange.css";

import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js"

import DateIcon from "../customIcons/dateIcon";
import './dateinput.scss';

export default function DateInput({placeholder = "Fecha de inicio",value,action}: {placeholder?: string,value:any,action:(arg:string)=>void}) {
    return(
        <div className="dateInput relative">
            <Flatpickr  className="border dateItem h-[40px] border-[#B2B2B2] rounded-[5px] block px-3 py-6 w-full relative z-10" options={{ 
                minDate: "2017-01-01",
                locale: Spanish,
                dateFormat: "d-m-Y",
                
                }}
                onChange={(date) => {
               
                if (date.length > 0) {
                    action(date[0].toISOString().split('T')[0]);
                } else {
                    action('');
                }
                }}
                />
            <span className="absolute right-3 top-4">
                <DateIcon/>
            </span>
             <label className='text-[10px] absolute left-2 bottom-1 text-secondary'>{placeholder}</label>
        </div>
    )
}