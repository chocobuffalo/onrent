'use client';
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import filterSlicer from "./features/ui/filterSlicer";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, PersistConfig } from "redux-persist";
import storage from 'redux-persist/lib/storage'
import { useDispatch, useSelector } from 'react-redux'


import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { FilterInterface } from "@/types/filters";
import createWebStorage from "redux-persist/es/storage/createWebStorage";

export interface RootInterface {
  filters: FilterInterface;
  
}


export const uiStore = configureStore({
    reducer: {
        filters:filterSlicer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type IURootState = ReturnType<typeof uiStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type IUAppDispatch = typeof uiStore.dispatch

/* // const isClient = typeof window !== "undefined";
// const createNoopStorage = () => {
//   return {
//     getItem(_key: string) {
//       return Promise.resolve(null);
//     },
//     setItem(_key: string, value: any) {
//       return Promise.resolve(value);
//     },
//     removeItem(_key: string) {
//       return Promise.resolve();
//     },
//   };
// };
// const storage =
//   isClient
//     ? createWebStorage("local")
//     : createNoopStorage();



const persistConfig:PersistConfig<RootInterface> = {
  key: 'root',
  storage:storage,
  whitelist: ['filters'], // Solo persiste el slice 'filters'
};

// Combine all reducers here
const combinedReducer = combineReducers({
    filters:filterSlicer,
})

const makeConfiguredStore = () =>
  configureStore({
    reducer: combinedReducer,
  })

export const makeStore = () =>{
    const isServer = typeof window === 'undefined';
    if (isServer) {
        return makeConfiguredStore()
    } else {
       const persistedReducer = persistReducer(persistConfig, combinedReducer)
      let store: any = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
      })
      store.__persistor = persistStore(store)
      return store
    }
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch'] */

