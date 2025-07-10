import { Session } from "@auth/core/types";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export const AuthProvider = ({ children, session }: { children: ReactNode; session: Session | null }) => {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  );
};