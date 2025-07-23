import { FilterInterface } from "@/types/filters";

export const filterInitialState:FilterInterface = {
    location:null,
    userID:null,
    type:null,
    rangePrice:{
        min:0,
        max:0,
    },
    startDate:null,
    endDate:null,
}