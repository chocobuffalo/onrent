'use client'
import { Provider } from "react-redux"

import { ReactNode, useRef } from "react"
import { SessionProvider } from "next-auth/react"
import { Session } from "@auth/core/types";
import { makeStore, UIAppStore } from "./redux/uistore"

import AuthSync from "@/auth/authSync";


const Providers = ({children,session}:{children:ReactNode,session:any}) => {
    const storeRef = useRef<UIAppStore | null>(null)
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore()
        // storeRef.current.dispatch(initializeCount(count))
    }
    return (
        <SessionProvider session={session}>
            <Provider store={storeRef.current}>
                <AuthSync />
                {children}
           
            </Provider>
        </SessionProvider>
    )
}

export default Providers

