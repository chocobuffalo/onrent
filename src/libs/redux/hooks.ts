'use client'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import type  { IURootState, IUAppDispatch } from './uistore'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()


export const useUIDispatch = useDispatch.withTypes<IUAppDispatch>()
export const useUISelector = useSelector.withTypes<IURootState>()
