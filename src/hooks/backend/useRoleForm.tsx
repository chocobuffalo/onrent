'use client';

import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import { newRole } from "@/services/newRole";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { setRole } from "@/libs/redux/features/auth/authSlicer";
import { userRoles } from "@/constants/user";

export default function useRoleForm(){
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState("");
    const [roleOption, setRoleOption] = useState<{label: string; value: string,color: string} | undefined>(userRoles[0]);
    const session =  useSession();
   const role = useUIAppSelector((state)=>state.auth || "");
   const dispatch = useUIAppDispatch();
    const validationSchema = Yup.object().shape({
        new_role: Yup.string().required("El rol es obligatorio"),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    });
    
    useEffect(()=>{
        if(session.status === "authenticated"){
            const userRole = role.profile.role || "";
         //   console.log(userRole," role en useRoleForm");
            const token = session.data?.user?.access_token || "";
            setToken(token);
            setValue("new_role", userRole);
            dispatch(setRole(userRole));
           // console.log(role," userRole en useRoleForm");
            const selectedRole = userRoles.filter((r) => r.value == userRole.toLowerCase());
          
            setRoleOption(selectedRole[0]);
         //   console.log(selectedRole," selectedRole en useRoleForm");
        }
        
    },[session,  role]);

    

    const onSubmit = async (data: { new_role: string }) => {
        //console.log(data);
        setIsLoading(true);
        try {
           const response = await newRole({ new_role: data.new_role, token });
           console.log(response)
              if (response.role) {
                setValue("new_role", response.role);
                dispatch(setRole(response.role));
              }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isValid,
        roleOption,
        isSubmitting,
        isLoading
    };

}