'use client';
import { interestLinks } from "@/constants/routes/frontend";
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
            console.log(catalogueValue);
            const path = interestLinks.find(link => link.machine_category === catalogueValue)?.slug || '/catalogo';
            redirect(path, RedirectType.push);
        }
    }
    
    return{handlerSubmit}
}