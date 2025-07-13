'use client'

import AsyncSelect from 'react-select/async';
import Select,{  components  } from 'react-select'

import useAutoComplete from '@/hooks/frontend/buyProcess/useAutoComplete';
import { FaMapMarkerAlt } from "react-icons/fa";
import { typeOptions } from '@/constants/routes/home';


export default function AdvanceFinder(){
    const { isLoading,loadOptions,handlerChange,handlerSubmit,handlerTypeMachine } = useAutoComplete()

    return (
        <div className="find-form max-w-[650px] mt-5">
           <form onSubmit={handlerSubmit}>
                <div className="finder-white flex gap-3.5">
                    <AsyncSelect 
                    className='min-w-[300px]'
                    components={{
                                    Control: ({ children, ...rest }) => (
                                        <components.Control className='px-3.5 italic' {...rest}>
                                            <FaMapMarkerAlt/> {children}
                                        </components.Control>
                                    )
                                }} 
                    cacheOptions={{
                        keepPreviousOptions: true,
                    }}
                    isSearchable
                    loadingMessage={() => "Cargando..."} 
                    noOptionsMessage={() => "Escribe para buscar..."}
                    placeholder="Indica tu ubicación"
                    loadOptions={loadOptions} 
                    onChange={(newValue)=> newValue !== null && handlerChange(newValue)}
                    defaultOptions />
                    <Select
                        className='min-w-[200px]'
                        loadingMessage={() => "Cargando..."} 
                        noOptionsMessage={() => "Escribe para buscar..."}
                        placeholder="Tipo de maquinaria"
                        options={typeOptions}
                        onChange={(newValue)=> newValue !== null && handlerTypeMachine(newValue)}
                    />
                    <button type='submit' className='bg-secondary cursor-pointer text-white px-5 py-2 rounded-sm hover:opacity-50 duration-300'>Buscar</button>
                </div>

           </form>
        </div>
    )
}