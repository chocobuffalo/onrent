'use client'
import { filterInitialState } from "@/constants/states";
import { createSlice } from "@reduxjs/toolkit";




export const filterSlicer = createSlice({
    name: 'filters',

    initialState:filterInitialState,
    reducers: {
        setStartDate:(state,action)=>{
            state.startDate = action.payload
        },
        setEndDate:(state,action)=>{
            state.endDate = action.payload
        },
        setMinPrice:(state,action)=>{
            state.rangePrice.min = action.payload
        },
        setMaxPrice:(state,action)=>{
            state.rangePrice.max = action.payload
        },
        setLocation:(state,action)=>{
            state.location = action.payload
        },
        setType:(state,action)=>{
            state.type = action.payload
        },
    },
})

export const {setStartDate,setEndDate,setMinPrice,setMaxPrice,setLocation,setType} = filterSlicer.actions
export default filterSlicer.reducer