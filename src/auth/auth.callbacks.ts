"use client";

import { AdapterUser } from "@auth/core/adapters";
// import { getLogin } from "@/libs/redux/features/auth/authSlicer";
// import { useUIAppDispatch } from "@/libs/redux/hooks";
// import { JWT } from "@auth/core/jwt";
// import { Session } from "@auth/core/types";
import { NextAuthConfig } from "next-auth";
export const callbacks: NextAuthConfig["callbacks"] = {
  authorized({ auth, request: { nextUrl } }) {
    const isLoggedIn = !!auth?.user;
    if (auth?.user?.email == "admin@example.com") {
      return false;
    }
    // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

    if (!isLoggedIn) {
      return false;
    }
    return true;
  },
  async jwt({ token, user, account, trigger, session }) {
    // Solo en el inicio de sesión, agregamos info del usuario al token
    if (user) {
      token.user = user;
    }
    //  console.log(token, user, account, trigger, session, 'jwt');
    // Refrescar token si es necesario
    if (trigger === "update") {
      return { ...token, ...session.user };
    }

    return token;
  },


  async redirect({ url, baseUrl }) {
    return `${url}`;
  },

  async session({ session, token }) {
    // Agregamos info del token a la sesión
    //console.log(session, token, 'session');
    session.user = token.user as AdapterUser;
    return session;
  },
};
