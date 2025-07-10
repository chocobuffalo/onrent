'use client'
import { Provider } from "react-redux"
import { store } from "./redux/store"
import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import { Session } from "@auth/core/types";


export const Providers = ({children}:{children:ReactNode}) => {
    
    return (
        <SessionProvider>
            <Provider store={store}>
                    {children}
            </Provider>
        </SessionProvider>
    )
}