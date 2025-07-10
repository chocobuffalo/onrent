import { JWT } from "@auth/core/jwt";
import { Session } from "@auth/core/types";
import { NextAuthConfig } from "next-auth";
export const callbacks:NextAuthConfig["callbacks"] = {
     async jwt({ token, user, account, trigger, session }) {
      // Solo en el inicio de sesión, agregamos info del usuario al token
      if (user) {
        token.user = user;
      }
      
      // Refrescar token si es necesario
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      
      return token;
    },


    async signIn({ user, account, profile, email, credentials }) {
      // if (account?.provider === "apple") {
      //   return profile?.email_verified
      // }
      console.log(account, profile, email);
      return true
    },



    async redirect({ url, baseUrl }) {
        
        return baseUrl
    },
    
    async session({ session, token }) {
      // Agregamos info del token a la sesión
      session.user = token.user as any;
      return session;
    },
}