'use client'
import { filterInitialState } from "@/constants/states";
import { createSlice } from "@reduxjs/toolkit";
import { set } from "react-hook-form";




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
        setFilters:(state,action)=>{
            state = {...state, ...action.payload}
        }
    },
})

export const {setStartDate,setEndDate,setMinPrice,setMaxPrice,setLocation,setType,setFilters} = filterSlicer.actions
export default filterSlicer.reducer