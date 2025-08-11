import { FilterInterface } from "@/types/filters";

export const filterInitialState:FilterInterface = {
    location:null,
    userID:null,
    type:null,
    needProject:false,
    rangePrice:{
        min:0,
        max:0,
    },
    startDate:null,
    endDate:null,
}