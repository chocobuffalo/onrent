'use client'
import { getLocationList } from "@/services/getLocationList.adapter";
import { setFilters, setLocation, setType } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { SelectInterface } from "@/types/iu";
import { debounce } from "@/utils/debounce";
import { LocationClient, SearchPlaceIndexForSuggestionsCommand } from "@aws-sdk/client-location";
import { redirect, RedirectType } from 'next/navigation'

import { useCallback,  useEffect,  useState } from "react";
import {  GroupBase,  OptionsOrGroups } from 'react-select';
import { storage } from "@/utils/storage";





export default  function useAutoComplete(checkpersist?: boolean) {
    const [options, setOptions] = useState<SelectInterface[]>([
       
    ])
    const uiSelector = useUIAppSelector((state) => state.filters);
    const locationLabel = uiSelector.location? uiSelector.location.label : '';
    const [inputValue,setInputValue] = useState<string>(locationLabel || '');
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const dispatch = useUIAppDispatch()
    
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


    useEffect(()=>{
        setInputValue(uiSelector?.location?.label || '');
    },[uiSelector.location])
    
    const handlerFocus=(text:string)=>{
        debouncedFilterColors(text)
        setOpen(true);
    }
       
    const handlerInputChange =(text:string)=>{
        debouncedFilterColors(text)
        setInputValue(text);
    }

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
            const getStorage = storage.getItem('filters');
            storage.setItem('filters', {...getStorage, location: {value: data.PlaceId, label: data.Title, lat, lon}});
           }
        })
    }
   

    return {options,
            uiSelector,
            dispatch,
            isLoading,
            open,
            setOpen,
            setInputValue,
            handlerFocus,
            handlerInputChange,
            inputValue,
            loadOptions,
            handlerChange,
            debouncedFilterColors
        }
}
