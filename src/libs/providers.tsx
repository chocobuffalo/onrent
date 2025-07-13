'use client'
import { Provider } from "react-redux"
import { store } from "./redux/store"
import { ReactNode, useRef } from "react"
import { SessionProvider } from "next-auth/react"
import { Session } from "@auth/core/types";
import { PersistGate } from "redux-persist/integration/react"
import { makeStore, UIAppStore } from "./redux/uistore"
import { FilterInterface } from "@/types/filters"


const Providers = ({filters,children}:{filters:FilterInterface,children:ReactNode}) => {
    const storeRef = useRef<UIAppStore | null>(null)
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore()
        // storeRef.current.dispatch(initializeCount(count))
    }
    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}

export default Providers

