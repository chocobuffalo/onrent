'use client';
import { OrderBookingInterface } from "@/types/orderBooking";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: OrderBookingInterface = {
    order_id: null,
    session_id: null,
}



const orderSlicer = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderId: (state, action: PayloadAction<number | null>) => {
      state.order_id = action.payload;
      // add to storage
      if (action.payload) {
        localStorage.setItem('order_id', action.payload.toString());
      } else {
        localStorage.removeItem('order_id');
      }
    },
    setSessionId: (state, action: PayloadAction<string | null>) => {
      state.session_id = action.payload;
      // add to storage
      if (action.payload) {
        localStorage.setItem('session_id', action.payload);
      } else {
        localStorage.removeItem('session_id');
      }
    },
  
  },
});

export const { setOrderId,setSessionId } = orderSlicer.actions;

export default orderSlicer.reducer;
