'use client'

import AsyncSelect from 'react-select/async';
import Select,{  components  } from 'react-select'

import useAutoComplete from '@/hooks/frontend/buyProcess/useAutoComplete';
import { FaMapMarkerAlt } from "react-icons/fa";
import { typeOptions } from '@/constants/routes/home';
import FilterInput from '@/components/atoms/filterInput/filterInput';
import './advanceFinder.scss';


export default function AdvanceFinder(){
    const { handlerSubmit,handlerTypeMachine } = useAutoComplete()

    return (
        <div className="find-form max-w-[650px] mt-5">
           <form onSubmit={handlerSubmit}>
                <div className="finder-white flex-col md:flex-row flex gap-3.5">
                    <FilterInput checkpersist={false}/>
                    <Select
                        className='bg-white w-full md:w-[250px] text-sm rounded'
                        classNames={{ control:()=> 'w-full md:w-[250px] no-border italic' }}
                        loadingMessage={() => "Cargando..."} 
                        noOptionsMessage={() => "Escribe para buscar..."}
                        placeholder="Tipo de maquinaria"
                        options={typeOptions}
                        onChange={(newValue)=> newValue !== null && handlerTypeMachine(newValue)}
                    />
                    <button type='submit' className='bg-secondary cursor-pointer hover:text-secondary hover:bg-white text-white px-5 py-2 rounded-sm  duration-300'>Buscar</button>
                </div>

           </form>
        </div>
    )
}