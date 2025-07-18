'use client'
import { useDispatch, useSelector, useStore } from 'react-redux'
import type {UIAppStore,UIRootState,UIAppDispatch} from './uistore'





// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useUIAppDispatch = useDispatch.withTypes<UIAppDispatch>()
export const useUIAppSelector = useSelector.withTypes<UIRootState>()
export const useUIAppStore = useStore.withTypes<UIAppStore>()
