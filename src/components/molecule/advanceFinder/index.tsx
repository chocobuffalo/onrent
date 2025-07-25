'use client'
import Select from 'react-select'
import useAutoComplete from '@/hooks/frontend/buyProcess/useAutoComplete';
import { typeOptions } from '@/constants/routes/home';
import FilterInput from '@/components/atoms/filterInput/filterInput';
import useSendAction from '@/hooks/frontend/buyProcess/useSendAction';

import './advanceFinder.scss';
import useSelectList from '@/hooks/frontend/buyProcess/useSelectList';
import { useState } from 'react';


export default function AdvanceFinder(){
     const {  filterStateType,
            selectedType,
            handlerChange,
             } = useSelectList();
    
    const { handlerSubmit } = useSendAction();
     const [options, setOptions] = useState(filterStateType || []);
    return (
        <div className="find-form max-w-[650px] mt-5">
           <div >
                <div className="finder-white flex-col md:flex-row flex gap-3.5">
                    <FilterInput checkpersist={false}/>
                    <Select
                        className='bg-white w-full md:w-[250px] flex items-center text-sm rounded'
                        classNames={{ control:()=> 'w-full md:w-[250px] no-border italic' }}
                        loadingMessage={() => "Cargando..."} 
                        noOptionsMessage={() => "Escribe para buscar..."}
                        placeholder="Tipo de maquinaria"
                        defaultValue={filterStateType}
                        value={selectedType}
                        options={typeOptions}
                        onChange={(newValue) => newValue !== null && handlerChange(newValue)}
                    />
                    <button type='submit'  onClick={handlerSubmit} className='bg-secondary cursor-pointer hover:text-secondary hover:bg-white text-white px-5 py-2 rounded-sm  duration-300'>Buscar</button>
                </div>

           </div>
        </div>
    )
}