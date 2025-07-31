'use client';
import React from 'react'
import './inputPrice.scss';

export default function InputPrice({id,type, name, placeholder, classNames, value, onChange}:{id:string,type:string, name?:string, placeholder?:string, classNames?:string, value?:string, onChange?: (value:string) => void}) {
  return (
    <div className="input-wrapper relative">
        <input type={type} name={name} value={value} onChange={(e) => onChange?.(e.target.value)} className="border-[#B2B2B2] rounded block w-full border-1 h-[40px] z-10 px-3 py-6 inputItem"  id={id} />
        <span className='text-[10px] absolute left-2 bottom-1 text-secondary'>{placeholder}</span>
    </div>
  )
}

 