import { SelectInterface } from "./iu";

export interface FilterInterface{
    location: SelectInterface |null,
    userID:string|null,
    needProject:boolean,
    type:SelectInterface[] | null | SelectInterface,
    rangePrice:{
        min:null|number,
        max:null|number,
    },
    startDate:null|string,
    endDate:null|string,
}