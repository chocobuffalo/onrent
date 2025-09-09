/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Provider } from "react-redux";
import { ReactNode, useRef, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { makeStore, UIAppStore } from "./redux/uistore";
import AuthSync from "@/components/organism/syncs/authSync";
import FilterSync from "@/components/organism/syncs/FilterSync";
import ProfileSync from "@/components/organism/syncs/profileSync";

// Extender Window de forma segura
declare global {
  interface Window {
    store?: UIAppStore;
  }
}

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

  // Exponer store globalmente para axios interceptor
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).store = storeRef.current;
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <Provider store={storeRef.current}>
        <AuthSync />
        <FilterSync />
        <ProfileSync />
        {children}
      </Provider>
    </SessionProvider>
  );
};

export default Providers;