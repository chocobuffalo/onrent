/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { configureStore } from "@reduxjs/toolkit";
import filterSlicer from "./features/ui/filterSlicer";
import authSlicer from "./features/auth/authSlicer";
import modalSlicer from "./features/ui/modalSlicer";

import { FilterInterface } from "@/types/filters";
import { AuthStateInterface } from "@/types/auth";
import { ModalStateInterface } from "@/types/iu";
import orderSlicer from "./features/ui/orderSlicer";
import { OrderBookingInterface } from "@/types/orderBooking";

export interface RootInterface {
  filters: FilterInterface;
  auth: AuthStateInterface;
  modal: ModalStateInterface;
  order: OrderBookingInterface
}

// nextjs config
export const makeStore = () => {
  return configureStore({
    reducer: {
      filters: filterSlicer,
      auth: authSlicer,
      modal: modalSlicer,
      order: orderSlicer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "auth/triggerAutoLogout"],
        },
      }),
  });
};

// Create a store instance to infer RootState
const store = makeStore();
export type RootState = ReturnType<typeof store.getState>;
// Infer the type of makeStore
export type UIAppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type UIRootState = ReturnType<UIAppStore["getState"]>;
export type UIAppDispatch = UIAppStore["dispatch"];