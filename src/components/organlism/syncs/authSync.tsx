'use client';

import { setAvatar, setEmail, setLogin, setName } from "@/libs/redux/features/auth/authSlicer";
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
      dispatch(setLogin(true));
      dispatch(setName(session.user.name || ''));
      dispatch(setEmail(session.user.email || ''));
      dispatch(setAvatar(session.user.image || '/path/to/default/avatar.png'));

    }
  }, [isLogin, status,session]);

  return null;
}
