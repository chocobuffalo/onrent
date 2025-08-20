/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  setAvatar,
  setEmail,
  setLogin,
  setName,
  setProfile,
} from "@/libs/redux/features/auth/authSlicer";
import { setUserID } from "@/libs/redux/features/ui/filterSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthSync() {
  const dispatch = useUIAppDispatch();
  const isLogin = useUIAppSelector((state) => state.auth.isLogin);
  const { data: session, status } = useSession();

  useEffect(() => {
   //// console.log(session, "AuthSync session");
    if (session?.user && !isLogin) {
      dispatch(setLogin(true));
      dispatch(setName(session.user.name || ""));
      dispatch(setEmail(session.user.email || ""));
      dispatch(setAvatar(session.user.image || "./user-circle.svg"));
      dispatch(setProfile(session.user.role || "cliente"));
      //dispatch(setUserID(session.user.user_id || ""));

    }
  }, [isLogin, status, session]);

  return null;
}