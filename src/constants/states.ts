import { FilterInterface } from "@/types/filters";

export const filterInitialState:FilterInterface = {
    location:null,
    userID:null,
    type:null,
    rangePrice:{
        min:null,
        max:null,
    },
    startDate:null,
    endDate:null,
}