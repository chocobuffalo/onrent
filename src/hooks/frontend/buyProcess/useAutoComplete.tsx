'use client'
import { getLocationList } from "@/services/getLocationList.adapter";
import { setLocation, setType } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { SelectInterface } from "@/types/iu";
import { debounce } from "@/utils/debounce";
import { LocationClient, SearchPlaceIndexForSuggestionsCommand } from "@aws-sdk/client-location";
import { redirect, RedirectType } from 'next/navigation'

import { useCallback,  useState } from "react";
import {  GroupBase,  OptionsOrGroups } from 'react-select';
import { storage } from "@/utils/storage";





export default  function useAutoComplete() {
    const [options, setOptions] = useState<SelectInterface[]>([
       
      ])
    const [inputValue,setInputValue] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useUIAppDispatch()
    const uiSelector = useUIAppSelector((state) => state.filters);
    
       const debouncedFilterColors = useCallback(
        debounce(async (inputValue: string) => {
            try {
                const res = await getLocationList(inputValue||'Ciudad de Mexico');
                setOptions(res);
                return res
            } catch (error) {
                console.error('Error filtering colors:', error);
                return options;
            }
        }, 500), // 500ms de delay
        [] // Dependencias vacías ya que no usamos variables externas
    );




    const loadOptions =   (
        inputValue: string,
        callback: (options: OptionsOrGroups<SelectInterface, GroupBase<SelectInterface>>) => void
        ) => {
            setIsLoading(true)
            debouncedFilterColors(inputValue).then((res:any)=>{
               // setIsLoading(false)
                callback(res);
            }).catch(()=>{
               // setIsLoading(false)
                callback(options);
            })
        };

        //setLocation,setType
    const handlerChange = (optionSelected:string)=>{
       // setInputValue(optionSelected.label)
       fecthLocation(optionSelected)
    }

    const handlerTypeMachine = (optionSelected:SelectInterface) =>{
        dispatch(setType([optionSelected]))
    }

    const fecthLocation = async (placeID:string) => {
         fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-place?place=${placeID}`)
        .then((res) =>res.json())
        .then((res) => {
           const { data } = res;
           ///console.log(data);
           if(data.Position && data.Position.length > 0){
               console.log( data);
            const [lon, lat] = data.Position;
            dispatch(setLocation({
                value: data.PlaceId,
                label: data.Title,
                lat,
                lon
            }))
           }
        })
    }
    const handlerSubmit = (e:any) =>{
        e.preventDefault()
        console.log(e);
        // add latitud and longitude to the location
        if(!uiSelector.location?.value) return;
        fecthLocation(uiSelector.location?.value || '');
        if(uiSelector.location && uiSelector.type !== null){
            storage.setItem('filters', uiSelector || '');
            const path = `/catalogo/${uiSelector.type[0].value || ''}`; 
            redirect(path,RedirectType.push);
        }
    }

    return {options,uiSelector,dispatch,isLoading,setInputValue,inputValue,loadOptions,handlerChange,handlerTypeMachine,handlerSubmit, debouncedFilterColors}
}
