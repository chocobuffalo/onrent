
'use client';
import { configureStore } from "@reduxjs/toolkit";
import filterSlicer from "./features/ui/filterSlicer";


import { FilterInterface } from "@/types/filters";

import authSlicer,{  AuthStateInterface } from "./features/auth/authSlicer";

export interface RootInterface {
  filters: FilterInterface;
  auth: AuthStateInterface;
}



// nextjs config
export const makeStore = () => {
  return configureStore({
    reducer: {
        filters: filterSlicer,
        auth: authSlicer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
  })
}

// Infer the type of makeStore
export type UIAppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type UIRootState = ReturnType<UIAppStore['getState']>
export type UIAppDispatch = UIAppStore['dispatch']
