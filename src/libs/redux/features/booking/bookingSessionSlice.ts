// src/libs/redux/features/booking/bookingSessionSlice.ts
'use client';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingItem {
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

interface BookingSessionState {
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

const initialState: BookingSessionState = {
    isActive: false,
    startDate: null,
    endDate: null,
    location: null,
    extras: {
        operador: false,
        certificado: false,
        combustible: false
    },
    items: []
};

const bookingSessionSlice = createSlice({
    name: 'bookingSession',
    initialState,
    reducers: {
        initBookingSession: (state, action: PayloadAction<{
            startDate: string;
            endDate: string;
            location: any;
            extras: any;
            projectId?: string;
            projectData?: any;
        }>) => {
            state.isActive = true;
            state.startDate = action.payload.startDate;
            state.endDate = action.payload.endDate;
            state.location = action.payload.location;
            state.extras = action.payload.extras;
            state.projectId = action.payload.projectId;
            state.projectData = action.payload.projectData;
            
            if (typeof window !== 'undefined') {
                localStorage.setItem('booking_session', JSON.stringify({
                    startDate: action.payload.startDate,
                    endDate: action.payload.endDate,
                    location: action.payload.location,
                    extras: action.payload.extras
                }));
            }
        },
        
        addItemToBooking: (state, action: PayloadAction<BookingItem>) => {
            state.items.push(action.payload);
            if (typeof window !== 'undefined') {
                localStorage.setItem('booking_items', JSON.stringify(state.items));
            }
        },

        incrementItemQuantity: (state, action: PayloadAction<{
            machineId: number;
            quantityToAdd: number;
        }>) => {
            const existingItem = state.items.find(
                item => item.machineId === action.payload.machineId && 
                        item.startDate === state.startDate && 
                        item.endDate === state.endDate
            );
            
            if (existingItem) {
                existingItem.quantity += action.payload.quantityToAdd;
                existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity * existingItem.dayLength;
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('booking_items', JSON.stringify(state.items));
                }
            }
        },

        incrementItemQuantityById: (state, action: PayloadAction<string>) => {
            const existingItem = state.items.find(item => item.id === action.payload);
            
            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity * existingItem.dayLength;
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('booking_items', JSON.stringify(state.items));
                }
            }
        },

        decrementItemQuantity: (state, action: PayloadAction<string>) => {
            const existingItem = state.items.find(item => item.id === action.payload);
            
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
                existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity * existingItem.dayLength;
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('booking_items', JSON.stringify(state.items));
                }
            }
        },
        
        removeItemFromBooking: (state, action: PayloadAction<string>) => {
            const itemToRemove = state.items.find(item => item.id === action.payload);
            console.log("🗑️ Eliminando item:", itemToRemove?.machineName);
            state.items = state.items.filter(item => item.id !== action.payload);
            console.log("📦 Items restantes:", state.items.length);
            
            if (typeof window !== 'undefined') {
                localStorage.setItem('booking_items', JSON.stringify(state.items));
                console.log("💾 localStorage actualizado");
            }
        },
        
        clearBookingSession: () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('booking_session');
                localStorage.removeItem('booking_items');
            }
            return initialState;
        }
    }
});

export const {
    initBookingSession,
    addItemToBooking,
    incrementItemQuantity,
    incrementItemQuantityById,
    decrementItemQuantity,
    removeItemFromBooking,
    clearBookingSession
} = bookingSessionSlice.actions;

export default bookingSessionSlice.reducer;