import React from 'react'
import BulldozerIcon from '../customIcons/bulldozers'
import  "./AddEnginery.scss"
export default function AddProject({func,active}:{func:()=>void,active:boolean}) {
  const activeClass = active ? 'active' : "";
//add-enginery
  return (
     <div className={`header-account `}>
        <div className={`flat-bt-top addEnginery`}>
            <button className={`sc-button d-flex align-center ${activeClass}`} onClick={func}>
                
                <span className={active?'text-white':'text-secondary'} >Añadir Proyecto</span>
            </button>
        </div>
    </div>
  )
}
