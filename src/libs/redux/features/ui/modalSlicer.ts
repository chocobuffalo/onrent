'use client';
import { createSlice } from "@reduxjs/toolkit";



export const modalSlicer = createSlice({
    name: 'modal',
    initialState: {
        isOpen: false,
    },
    reducers: {
        openModal: (state) => {
            state.isOpen = true;
            
        },
        closeModal: (state) => {
            state.isOpen = false;
        },
        toggleModal: (state) => {
            state.isOpen = !state.isOpen;
        }
    },
});

export const { openModal, closeModal, toggleModal } = modalSlicer.actions;
export default modalSlicer.reducer;