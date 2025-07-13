'use client'
import { Provider } from "react-redux"
import { store } from "./redux/store"
import { ReactNode, useRef } from "react"
import { SessionProvider } from "next-auth/react"
import { Session } from "@auth/core/types";
import { PersistGate } from "redux-persist/integration/react"
import { uiStore } from "./redux/uistore"


const Providers = ({children}:{children:ReactNode}) => {
    return (
        <Provider store={uiStore}>
            {children}
        </Provider>
    )
}

export default Providers