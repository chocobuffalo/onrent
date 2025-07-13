'use client'
import { getLocationList } from "@/adapters/getLocationList.adapter";
import { SelectInterface } from "@/types/iu";
import { debounce } from "@/utils/debounce";
import { LocationClient, SearchPlaceIndexForSuggestionsCommand } from "@aws-sdk/client-location";
import { useCallback,  useState } from "react";
import {  GroupBase,  OptionsOrGroups } from 'react-select';





export default  function useAutoComplete() {
    const [options, setOptions] = useState<SelectInterface[]>([
        { value: 'chocolate', label: 'Chocolate',color:'#fff' },
        { value: 'strawberry', label: 'Strawberry',color:'#fff' },
        { value: 'vanilla', label: 'Vanilla',color:'#fff' }
      ])
    const [inputValue,setInputValue] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    
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

    const handlerChange = (optionSelected:SelectInterface)=>{

    }

    const handlerTypeMachine = (optionSelected:SelectInterface) =>{

    }

    const handlerSubmit = (e:any) =>{
        e.preventDefault()
        console.log(e);
    }

    return {options,isLoading,setInputValue,inputValue,loadOptions,handlerChange,handlerTypeMachine,handlerSubmit}
}
