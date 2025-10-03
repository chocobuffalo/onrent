// src/types/bookingSession.ts
export interface BookingItem {
    id: string;
    machineId: number;
    machineName: string;
    quantity: number;
    startDate: string;
    endDate: string;
    dayLength: number;
    unitPrice: number;
    totalPrice: number;
    requires_operator: boolean;
    requires_fuel: boolean;
    certification_level: string;
}

export interface BookingSessionState {
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    location: {
    lat: number;
    lng: number;
    address?: string;
    } | null;
    extras: {
    operador: boolean;
    certificado: boolean;
    combustible: boolean;
    };
    projectId?: string;
    projectData?: any;
    items: BookingItem[];
}