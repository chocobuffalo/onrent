/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Provider } from "react-redux";

import { ReactNode, useRef } from "react";
import { SessionProvider } from "next-auth/react";

import { makeStore, UIAppStore } from "./redux/uistore";

import AuthSync from "@/components/organism/syncs/authSync";
import FilterSync from "@/components/organism/syncs/FilterSync";

const Providers = ({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) => {
  const storeRef = useRef<UIAppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // storeRef.current.dispatch(initializeCount(count))
  }
  return (
    <SessionProvider session={session}>
      <Provider store={storeRef.current}>
        <AuthSync />
        <FilterSync />
        {children}
      </Provider>
    </SessionProvider>
  );
};

export default Providers;
