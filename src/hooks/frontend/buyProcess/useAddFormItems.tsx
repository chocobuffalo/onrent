'use client'
import {useState} from 'react'
export default function useAddFormItems() {
    // Custom hook logic
    const [count, setCount] = useState<number>(1)
    const increment = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault()
        setCount(count + 1)
    }
    const decrement = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(count > 1){
            setCount(count - 1)
        }
    }


    const disableTop =(number:number,limit:number)=> {
        if(limit>0)return false
        if(number >= limit){
            return true
        }
        return false
    }
    const disableBottom = (number:number,limit:number) => {
        if(number <= 1){
            return true
        }
        return false
    }


    return{
        count,
        disableTop,
        disableBottom,
        increment,
        decrement
    }

}
