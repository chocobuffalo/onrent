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

export const projectStates = [{ label: "Planificación", value: "planning",color:'#007bff' }, { label: "Activo", value: "active",color:'#ffc107' }, { label: "Finalizado", value: "completed",color:'#28a745' },{ label: "Cancelado", value: "cancelled",color:'#f44336' }];
