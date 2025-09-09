'use client';

import { setAvatar, setName, setPhone } from "@/libs/redux/features/auth/authSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import getProfile from "@/services/getProfile";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


//  const [profile, setProfile] = useState({
//         fullName: "",
//         telephone: "",
//         email: "",
//         role: "",
//         avatar: ""
//     });

//     const {data:user} = useSession();
//     const accessToken = user?.user?.access_token|| "";

//     useEffect(()=>{
//         getProfile(accessToken).then((data)=>{
//             console.log(data)
//             setProfile({
//                 fullName: data.name || "",
//                 telephone: data.phone || "",
//                 email: data.email || "",
//                 role: data.role || "",
//                 avatar: data.image_base64 || "/profile-placeholder.svg"
//             });
//         })
//     },[accessToken,user])
   
export default function ProfileSync() {
    const dispatch = useUIAppDispatch();
    const phone = useUIAppSelector((state) => state.auth.profile.phone);
    const name = useUIAppSelector((state) => state.auth.profile.name);
    const email = useUIAppSelector((state) => state.auth.profile.email);
    const avatar = useUIAppSelector((state) => state.auth.profile.avatarUrl);
    const {data:user} = useSession();
    const getProfileAsync = async(token:string)=>{
         getProfile(token).then((data)=>{
            dispatch(setName(data.name || ""));
            dispatch(setPhone(data.phone || ""));
            dispatch(setAvatar(data.image_base64 ? `data:image/jpeg;base64,${data.image_base64}` : "/profile-placeholder.svg" ));
         })
    }

    useEffect(()=>{
        if(user?.user?.access_token){
            getProfileAsync(user.user.access_token);
        }
    },[user])

    return null;
}