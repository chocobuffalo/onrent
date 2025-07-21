'use client';

import { getLogin } from "@/libs/redux/features/auth/authSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { useSession } from "next-auth/react";
import { useEffect } from "react";



export default function AuthSync() {
  const dispatch = useUIAppDispatch();
  const isLogin = useUIAppSelector((state) => state.auth.isLogin);
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log(session, 'AuthSync session');
    if (session?.user && !isLogin) {
      dispatch(getLogin(true));
    }
  }, [isLogin, status,session]);

  return null;
}
