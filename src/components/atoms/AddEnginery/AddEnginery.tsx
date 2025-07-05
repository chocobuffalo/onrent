import React from 'react'
import BulldozerIcon from '../customIcons/bulldozers'
import style from "./AddEnginery.module.css"
export default function AddEnginery({func,active}:{func:()=>void,active:boolean}) {
  const activeClass = active ? style.active : "";

  return (
     <div className="header-account">
        <div className="flat-bt-top">
            <button className={`sc-button d-flex align-center ${activeClass}`} onClick={func}>
                <BulldozerIcon color="#ff7101"/>
                <span>Añadir Maquinaria</span>
            </button>
        </div>
    </div>
  )
}
