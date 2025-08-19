import { SelectInterface } from "./iu";

export interface FilterInterface {
    location: SelectInterface | null;
    userID: string | null;
    needProject: boolean;
    type: SelectInterface[] | null | SelectInterface;
    machineType: null;
    rangePrice: {
        min: null | number;
        max: null | number;
    };
    startDate: null | string;
    endDate: null | string;
    page: number;
    pageSize: number;
    nationalOnly: boolean;
}
