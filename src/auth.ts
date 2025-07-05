
import Apple from "next-auth/providers/apple"
import Google from "next-auth/providers/google"
import NextAuth from "next-auth"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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
    Apple
  ],
})