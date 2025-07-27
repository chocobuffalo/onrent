import Credentials from "@auth/core/providers/credentials";
import Apple from "next-auth/providers/apple";
import Google from "next-auth/providers/google";

export const providers =  [
    Credentials({
        name: "Credentials",
        credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log(credentials, req);
        // contact with backend
        return null;
      }
    }),
    Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
      params: {
        redirect_uri: process.env.NEXTAUTH_URL + '/api/auth/callback/google',
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
        scope: "openid email profile"
      }
    }
  }),
    Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
      authorization: {
        params: {
          redirect_uri: process.env.NEXTAUTH_URL + '/api/auth/callback/apple',
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        }
      }
    })
    
  ]
