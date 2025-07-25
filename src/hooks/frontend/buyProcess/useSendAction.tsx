'use client';
import { useUIAppSelector } from "@/libs/redux/hooks";
import { redirect, RedirectType } from 'next/navigation'

export default function useSendAction(){
    const uiSelector = useUIAppSelector((state) => state.filters);
    // Send to catalogue
    const handlerSubmit = (e:any) =>{
            // // add latitud and longitude to the location
        if(uiSelector.location  && uiSelector.type){
            console.log(uiSelector);
            const path = `/catalogo/${uiSelector.type[0].value || ''}`; 
            redirect(path,RedirectType.push);
        }
    }
    
    return{handlerSubmit}
}