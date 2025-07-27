'use client';

import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js"
import { formatDate } from "@/utils/formatDate";
import DateIcon from "../customIcons/dateIcon";
import "flatpickr/dist/themes/material_orange.css";
import './dateinput.scss';

export default function DateInput({placeholder = "Fecha de inicio",value,action}: {placeholder?: string,value:any,action:(arg:string)=>void}) {
   
    return(
        <div className="dateInput relative">
            <Flatpickr value={value} className="border dateItem h-[40px] border-[#B2B2B2] rounded-[5px] block px-3 py-6 w-full relative z-10" options={{ 
                //la fecha mínima es hoy y el de formato d-m-Y
                minDate: "today",
                locale: Spanish,
                dateFormat: "d-m-Y",
                
                }}
                onChange={(date) => {
                    if (date.length > 0) {
                      action(formatDate(new Date(date[0]).toISOString()));
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