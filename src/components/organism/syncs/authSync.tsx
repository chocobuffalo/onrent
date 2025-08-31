/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  setAvatar,
  setEmail,
  setLogin,
  setName,
  setRole,
  setProfile
} from "@/libs/redux/features/auth/authSlicer";
import { setUserID } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

// Extender tipos de NextAuth para incluir campos personalizados
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  user_id?: string;
  token?: string;
}

interface ExtendedSession {
  user?: ExtendedUser;
  accessToken?: string;
  access_token?: string;
}

export default function AuthSync() {
  const dispatch = useUIAppDispatch();
  const isLogin = useUIAppSelector((state) => state.auth.isLogin);
  const { data: session, status } = useSession();

  useEffect(() => {
   //// console.log(session, "AuthSync session");
    if (session?.user && !isLogin) {
      const extendedSession = session as ExtendedSession;
      const user = extendedSession.user;
      
      dispatch(setLogin(true));
      dispatch(setName(user?.name || ""));
      dispatch(setEmail(user?.email || ""));
      dispatch(setAvatar(user?.image || "/user-circle.svg"));
      dispatch(setRole(user?.role || "cliente"));
      //dispatch(setUserID(user?.user_id || ""));
      
      // CRÍTICO: Agregar sincronización del token
      const token = user?.token || extendedSession.accessToken || extendedSession.access_token || "";
      
      if (token) {
        dispatch(setProfile({
          name: user?.name || "",
          email: user?.email || "",
          avatarUrl: user?.image || "/user-circle.svg",
          role: user?.role || "cliente",
          userID: user?.user_id || "",
          token: token,
        }));
      }
      
      console.log("AuthSync: Token sincronizado correctamente", {
        hasToken: !!token,
        userId: user?.user_id,
        tokenSource: user?.token ? 'user.token' : extendedSession.accessToken ? 'accessToken' : 'access_token'
      });
    }
  }, [isLogin, status, session]);

  return null;
}