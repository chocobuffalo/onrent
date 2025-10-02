import NextAuth from "next-auth";
import { AuthConfig } from "@auth/core/types";
import { providers } from "./auth/auth.provider";
import { callbacks } from "./auth/auth.callbacks";

// Extensión de tipos de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      user_id?: number;
      role?: string;
      access_token?: string;
      name?: string;
      email?: string;
      phone?: string;
      odoo_partner_id?: any;
      image?: string;
    }
  }

  interface User {
    user_id?: number;
    role?: string;
    access_token?: string;
    phone?: string;
    odoo_partner_id?: any;
  }
}
declare module "@auth/core/jwt" {
  interface JWT {
    user_id?: number;
    role?: string;
    access_token?: string;
    accessToken?: string;
    phone?: string;
    odoo_partner_id?: any;
  }
}

export const authOptions: AuthConfig = {
  debug: false,
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
    newUser: "/iniciar-session",
    error: "/iniciar-session",
    signOut: "/",
  },
  events: {
    async session(event){
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