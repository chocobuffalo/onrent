'use client';
import { useUIAppSelector } from "@/libs/redux/hooks";
import { redirect, RedirectType } from 'next/navigation'

export default function useSendAction(){
    const uiSelector = useUIAppSelector((state) => state.filters);
    // Send to catalogue
    const handlerSubmit = (e:any) =>{
            // // add latitud and longitude to the location
        if(uiSelector.location  && uiSelector.type){
            const catalogue = uiSelector.type;
            let catalogueValue = '';
            if (Array.isArray(catalogue)) {
                catalogueValue = catalogue.length > 0 && catalogue[0]?.value ? catalogue[0].value : '';
            } else if (catalogue && 'value' in catalogue) {
                catalogueValue = catalogue.value;
            }
            const path = `/catalogo/${catalogueValue}`;
            redirect(path, RedirectType.push);
        }
    }
    
    return{handlerSubmit}
}