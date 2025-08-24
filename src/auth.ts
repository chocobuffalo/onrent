// src/auth.ts
import NextAuth from "next-auth";
import { AuthConfig } from "@auth/core/types";
import { providers } from "./auth/auth.provider";
import { callbacks } from "./auth/auth.callbacks";


declare module "next-auth" {
  interface User {
    access_token?: string;
    role?: string;
  }
}

export const authOptions: AuthConfig = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET,
  providers,
  callbacks,
  session: {
    strategy: "jwt",
    maxAge: 6 * 24 * 60 * 60, // 6 días
    updateAge: 24 * 60 * 60, // Actualizar diariamente
  },
  jwt: {
    maxAge: 24 * 60 * 60 * 6,
  },
  pages: {
    signIn: "/iniciar-session",
    newUser: "/complete-usuario",
  },
  events: {
    async session(event){
       console.log('Console log from session event: ', event);

    },
    async signOut(event) {
      
      if ('token' in event && event.token?.accessToken) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/session/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${event.token.accessToken}`
            }
          });
          
          if (!response.ok) {
            console.error('Error al cerrar sesión en el backend:', response.statusText);
          } else {
            console.log('✅ Sesión cerrada en el backend');
          }
        } catch (error) {
          console.error('Error en logout del backend:', error);
        }
      }
    }
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);