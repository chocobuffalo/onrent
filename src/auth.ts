
import NextAuth from "next-auth"
import { JWT } from "@auth/core/jwt";
import { AuthConfig, Session } from "@auth/core/types";
import { providers } from "./auth/auth.provider";
import { callbacks } from "./auth/auth.callbacks";


export const authOptions: AuthConfig ={
  debug: true,
  secret: process.env.AUTH_SECRET,
  providers,
  session: {
    strategy:"jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 días
    updateAge: 24 * 60 * 60, // Actualizar diariamente
  },
  jwt:{
    maxAge: 24 * 60 * 60 * 7,

  },
  pages:{
    signIn:'/iniciar-session',
    newUser: '/complete-usuario'
  },
  callbacks
}
 
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)