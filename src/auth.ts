import NextAuth from "next-auth";
// import { JWT } from "@auth/core/jwt";
import { AuthConfig } from "@auth/core/types";
import { AdapterUser } from "next-auth/adapters";
import { providers } from "./auth/auth.provider";

// Extend User type to include access_token
declare module "next-auth" {
  interface User {
    access_token?: string;
  }
}

export const authOptions: AuthConfig = {
  debug: false,
  secret: process.env.AUTH_SECRET,
  providers,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 días
    updateAge: 24 * 60 * 60, // Actualizar diariamente
  },
  jwt: {
    maxAge: 24 * 60 * 60 * 7,
  },
  pages: {
    signIn: "/iniciar-session",
    newUser: "/complete-usuario",
  },
  callbacks: {
     async signIn({ user, account, profile }){

        try{

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/user/social_login`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: profile?.email,
              name: profile?.name,
              picture: profile?.image,
              oauth_provider: account?.provider,
              id_token: account?.id_token,
              access_token: account?.access_token,
            }),
          });

          


           if (!response.ok) {
            return false;
          }

          const { access_token } = await response.json();

          // añadimos el token al user

          user.access_token = access_token;

          return true;
        }catch(e){
          console.error("Error al conectar con el backend:", e); 
          return false;
        }

        
     },
    // authorized callback removed because it is not supported by NextAuth
    async jwt({ token, user, account, trigger, session }) {
      
      // Solo en el inicio de sesión, agregamos info del usuario al token
      if (user) {
        token.user = user;
      }
   
      // Refrescar token si es necesario
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
  
      if (account?.provider === "google") {
        return { ...token, accessToken: user.access_token }
      }
  
      return token;
    },
  
  
    async redirect({ url}) {
      return `${url}`;
    },
    async session({ session, token }) {
      session.user = token.user as AdapterUser;
      console.log(session, token);
      return session;
    },
  },
  events:{
    async signOut(event){
      console.log('🔑 signOut event triggered');
      if ('token' in event) {
        console.log('Token:', event.token);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/session/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${event.token?.accessToken}`
          }
        });
        if (!response.ok) {
          console.error('Error al cerrar sesión en el backend:', response.statusText);
        }
        console.log(await response.json(),'log out');
      }
      if ('session' in event) {
        console.log('Session:', event.session);
      }
      // Aquí puedes agregar lógica adicional al cerrar sesión, como limpiar cookies o token
      return;
    }
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
