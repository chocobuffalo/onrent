'use client';
import { getLogin } from "@/libs/redux/features/auth/authSlicer";
import { useUIAppDispatch } from "@/libs/redux/hooks";
import cookieSession from "@/utils/cookieSession";
import { JWT } from "@auth/core/jwt";
import { Session } from "@auth/core/types";
import { NextAuthConfig } from "next-auth";
export const callbacks:NextAuthConfig["callbacks"] = {
     async jwt({ token, user, account, trigger, session }) {
      // Solo en el inicio de sesión, agregamos info del usuario al token
      if (user) {
        token.user = user;
      }
      console.log(token, user, account, trigger, session, 'jwt');
      // Refrescar token si es necesario
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      
      return token;
    },


    async signIn({ user, account, profile, email, credentials }) {
      // cookieSession({
      //   email: 'juanvs23@gamil.com',
      //   token: '1234567890abcdefg'
      // })
      console.log(account, profile, email,'signIn',user);
      return true
    },



    async redirect({ url, baseUrl }) {
        
        return `${baseUrl}/${url}`;
    },
    
    async session({ session, token }) {
      // Agregamos info del token a la sesión
      console.log(session, token, 'session');
      session.user = token.user as any;
      return session;
    },
}