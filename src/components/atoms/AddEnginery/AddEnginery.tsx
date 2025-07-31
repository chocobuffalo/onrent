import React from 'react'
import BulldozerIcon from '../customIcons/bulldozers'
import  "./AddEnginery.scss"
export default function AddEnginery({func,active}:{func:()=>void,active:boolean}) {
  const activeClass = active ? 'active' : "";
//add-enginery
  return (
     <div className={`header-account `}>
        <div className={`flat-bt-top addEnginery`}>
            <button className={`sc-button d-flex align-center ${activeClass}`} onClick={func}>
                <BulldozerIcon color="#ff7101"/>
                <span className={active?'text-white':'text-secondary'} >Añadir Maquinaria</span>
            </button>
        </div>
    </div>
  )
}
