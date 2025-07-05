'use client'
import { Provider } from "react-redux"
import { store } from "./redux/store"
import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"


export const Providers = ({children}:{children:ReactNode}) => {
   

    return (
        <Provider store={store}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </Provider>
    )
}