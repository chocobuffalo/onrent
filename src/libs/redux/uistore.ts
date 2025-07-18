
'use client';
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import filterSlicer from "./features/ui/filterSlicer";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, PersistConfig } from "redux-persist";
import storage from 'redux-persist/lib/storage'
import { useDispatch, useSelector } from 'react-redux'


import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { FilterInterface } from "@/types/filters";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
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
    }
  })
}

// Infer the type of makeStore
export type UIAppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type UIRootState = ReturnType<UIAppStore['getState']>
export type UIAppDispatch = UIAppStore['dispatch']
