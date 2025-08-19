import { FilterInterface } from "@/types/filters";

export const filterInitialState: FilterInterface = {
    location: null,
    userID: null,
    type: null,
    machineType: null,
    needProject: false,
    rangePrice: {
        min: 0,
        max: 0,
    },
    startDate: null,
    endDate: null,
    page: 1,
    pageSize: 10,
    nationalOnly: false
};
