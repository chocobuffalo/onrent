"use client";
import { useUIAppSelector } from "@/libs/redux/hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function useNewProjectForm() {
    const {userID} = useUIAppSelector(state => state.filters);
    const session = useSession();
    console.log(session);
       const router = useRouter();
       useEffect(() => {
            if( typeof window !== "undefined"){
                if (userID === null  && session.status !== "authenticated") {
                    router.push("/iniciar-session");
                }
            }
       }, [userID, session.status]);
       return {userID};
}
