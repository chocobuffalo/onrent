'use client'

import useAddFormItems from "@/hooks/frontend/buyProcess/useAddFormItems";


export default function AddFormItems({name, count, increment, decrement, disableTop, disableBottom}:{name:string, count:number, increment: (e: React.MouseEvent<HTMLButtonElement>) => void, decrement: (e: React.MouseEvent<HTMLButtonElement>) => void, disableTop: (count: number, max: number) => boolean, disableBottom: (count: number, min: number) => boolean}){


    return (
        <div className="addItem flex items-center gap-1.5">
             <button disabled={disableBottom(count, 1)}   type="button" className=" w-[40px] cursor-pointer h-[24px] flex items-center justify-center border border-[#bbb] text-[#bbb] rounded-sm hover:bg-secondary hover:border-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={decrement}>-</button>

                <input className="text-center text-sm  w-[24px] h-[24px] " name={name}  value={count}/>

            <button disabled={disableTop(count, 5)}  type="button" className=" w-[40px] cursor-pointer h-[24px] flex items-center justify-center border border-[#bbb] text-[#bbb] rounded-sm hover:bg-secondary hover:border-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={increment}>+</button>

        </div>
    )
}