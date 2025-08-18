import { AdapterUser } from "@auth/core/adapters";
// import { getLogin } from "@/libs/redux/features/auth/authSlicer";
// import { useUIAppDispatch } from "@/libs/redux/hooks";
// import { JWT } from "@auth/core/jwt";
// import { Session } from "@auth/core/types";
import { NextAuthConfig } from "next-auth";
export const callbacks: NextAuthConfig["callbacks"] = {
   async signIn({ user, account, profile }){
      console.log('🔑 signIn callback triggered');
      console.log('User:', user);
      console.log('Account:', account);
      console.log('Profile:', profile);
    return true;
   },
  authorized({ auth }) {
  console.log('🔑 Authorized');
      console.log('User:', auth);
   
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
      console.log('🔄 jwt callback triggered');
      console.log('Initial token:', token);
      console.log('User:', user);
      console.log('Account:', account);
    // Solo en el inicio de sesión, agregamos info del usuario al token
    if (user) {
      token.user = user;
    }
    //  console.log(token, user, account, trigger, session, 'jwt');
    // Refrescar token si es necesario
    if (trigger === "update") {
      return { ...token, ...session.user };
    }

    if (account?.provider === "google") {
      return { ...token, accessToken: account.access_token }
    }

    return token;
  },


  async redirect({ url}) {
    return `${url}`;
  },
  async session({ session, token }) {
   console.log('🔄 session callback triggered');
      console.log('Session:', session);
      console.log('Token:', token);
    session.user = token.user as AdapterUser;
    return session;
  },
};
