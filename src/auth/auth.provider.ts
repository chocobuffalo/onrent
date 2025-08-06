
import createUser from "@/services/createUser";
import Credentials from "@auth/core/providers/credentials";
import Apple from "next-auth/providers/apple";
import Google from "next-auth/providers/google";

export const providers =  [
    Credentials({
        name: "Credentials",
        credentials: {
          name: { label: "Name", type: "text" },
          role: { label: "User Type", type: "select", options: ["cliente", "proveedor", "cliente_proveedor"] },
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
        
          
          // contact with backend
          const res = await createUser({
            email: credentials.email as string,
            name: credentials.name as string,
            password: credentials.password as string,
            role: credentials.role as string,
          })
          console.log(res, "authorize response");
        if (res.responseStatus === 200) {
         return res.response;
        }        
        
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
