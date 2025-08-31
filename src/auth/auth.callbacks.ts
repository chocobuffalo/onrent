// src/auth/auth.callbacks.ts
import { AdapterUser } from "@auth/core/adapters";
import { NextAuthConfig } from "next-auth";
import { JWT } from "@auth/core/jwt";
import { Session } from "@auth/core/types";

interface ExtendedUser extends AdapterUser {
  access_token?: string;
  role?: string;
  user_id?: string;
  name?: string;
}

interface ExtendedToken extends JWT {
  user?: ExtendedUser;
  accessToken?: string;
  role?: string;
}

interface ExtendedSession extends Session {
  accessToken?: string;
  user: ExtendedUser;
}

interface SocialLoginResponse {
  access_token: string;
  message?: string;
  user: {
    role: string;
    user_id: string;
    name: string;
  };
}

export const callbacks: NextAuthConfig["callbacks"] = {
  async signIn({ user, account, profile }) {
    // console.log('🔑 signIn callback triggered');
    // console.log('User:', user);
    // console.log('Account:', account);
    // console.log('Profile:', profile);

    // Para login con credenciales (email/password) - ya manejado en provider
    if (account?.provider === "credentials") {
      return !!user; // El provider ya validó las credenciales
    }

    // Para OAuth (Google, Apple, etc.)
    if (account?.provider === "google" || account?.provider === "apple") {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ORIGIN}/api/user/social_login`, {
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

          // redireccionar

          return false;
        }
        const data: SocialLoginResponse = await response.json();
        const extendedUser = user as ExtendedUser;
        console.log(data,'sign callback');
        extendedUser.access_token = data.access_token;
        extendedUser.role = data?.user.role || "cliente"; // Asignar rol por defecto si no se proporciona
        extendedUser.user_id = data?.user.user_id || ""; // Asignar user_id por defecto si no se proporciona
        return true;
      } catch (e) {
        console.error("Error al conectar con el backend:", e);
        return false;
      }
    }

    return true;
  },

  authorized({ auth, request: { nextUrl } }) {
    // console.log('🔑 Authorized callback');
    // console.log('Auth:', auth);
    // console.log('URL:', nextUrl.pathname);
    
    const isLoggedIn = !!auth?.user;
    
    // Bloquear admin específico si es necesario
    if (auth?.user?.email === "admin@example.com") {
      return false;
    }
    
    // Rutas que requieren autenticación
    const protectedRoutes = ['/dashboard', '/profile', '/admin'];
    const isProtectedRoute = protectedRoutes.some(route => 
      nextUrl.pathname.startsWith(route)
    );
    
    if (isProtectedRoute && !isLoggedIn) {
      return false;
    }
    
    return true;
  },

  async jwt({ token, user, account, trigger, session }) {
    // console.log('🔄 jwt callback triggered');
    // console.log('Initial token:', token);
    console.log('User:', user);
    // console.log('Account:', account);

    const extendedToken = token as ExtendedToken;

    // En el primer login, guardar info del usuario
    if (user) {
      const extendedUser = user as ExtendedUser;
      extendedToken.user = extendedUser;
      
      // Guardar access_token del backend si existe
      if (extendedUser.access_token) {
        extendedToken.accessToken = extendedUser.access_token;
      }
      
      // Guardar role si existe
      if (extendedUser.role) {
        extendedToken.role = extendedUser.role;
      }
    }

    // Refrescar token si es necesario
    if (trigger === "update" && session?.user) {
      const sessionUser = session.user as ExtendedUser;
      return { 
        ...extendedToken, 
        user: {
          ...extendedToken.user,
          ...sessionUser
        }
      };
    }

    // Para Google OAuth
    if (account?.provider === "google") {
      const extendedUser = user as ExtendedUser;
      extendedToken.accessToken = extendedUser?.access_token || account.access_token || undefined;
    }

    return extendedToken;
  },

  async redirect({ url }) {
    return url;
  },

  async session({ session, token }) {
    // console.log('🔄 session callback triggered');
    // console.log('Session:', session);
    // console.log('Token:', token);
    
    const extendedToken = token as ExtendedToken;
    const extendedSession = session as ExtendedSession;
    
    // Mantener la estructura del user
    if (extendedToken.user) {
      extendedSession.user = extendedToken.user;
    }
    
    // Exponer accessToken en la sesión
    if (extendedToken.accessToken) {
      extendedSession.accessToken = extendedToken.accessToken;
    }
    
    // Exponer role en el user
    if (extendedToken.role && extendedSession.user) {
      extendedSession.user.role = extendedToken.role;
    }
    
    return extendedSession;
  },
};