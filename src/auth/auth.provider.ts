import loginUser from "@/services/loginUser";
import Credentials from "@auth/core/providers/credentials";
import Apple from "next-auth/providers/apple";
import Google from "next-auth/providers/google";
import { LoginResponse } from "@/types/auth";

export const providers = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials): Promise<any>  {
      try {
        const res: LoginResponse = await loginUser({
          email: credentials?.email as string,
          password: credentials?.password as string,
        });

        if (res?.access_token) {
          return {
            user_id: res.user.user_id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            access_token: res.access_token,
          };
        }

        return null;
      } catch (error) {
        console.error("Login error:", error);
        return null;
      }
    },
  }),
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
      params: {
        redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google",
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
        scope: "openid email profile",
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
  }),
  Apple({
    clientId: process.env.APPLE_ID,
    clientSecret: process.env.APPLE_SECRET,
    authorization: {
      params: {
        redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/apple",
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
        scope: "openid email profile",
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
  }),
];
