'use client';

import { useToast } from "@/hooks/frontend/ui/useToast";
import { setAvatar, setConstanciaPDF, setContactoFiscal, setDireccionEmpresa, setDireccionFiscal, setEmpleados, setEmpresa, setName, setPhone, setRazonSocial, setRepresentanteLegal, setRFC, setRfcEmpresa, setTelefonoContacto } from "@/libs/redux/features/auth/authSlicer";
import { useUIAppDispatch, useUIAppSelector } from "@/libs/redux/hooks";
import { getCompanyInfo } from "@/services/getCompanyInfo";
import { getFiscalInfo } from "@/services/getFiscalInfo";
import getProfile from "@/services/getProfile";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

   
export default function ProfileSync() {
    const dispatch = useUIAppDispatch();
    const { toastCriticalAction } = useToast();
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
         getFiscalInfo(token).then((data)=>{
            /**
             * constancia_pdf:"",
             * direccion_fiscal:"",
             * razon_social:"",
             * rfc:""
             */
            dispatch(setConstanciaPDF(data.constancia_pdf || ""));
            dispatch(setDireccionFiscal(data.direccion_fiscal || ""));
            dispatch(setRazonSocial(data.razon_social || ""));
            dispatch(setRFC(data.rfc || ""));
         });
         getCompanyInfo(token).then((data)=>{
            // Handle company info if needed
            
            if(data === null){
                console.log("No se pudo obtener la información de la empresa, forzando logout");
                toastCriticalAction('El token ha expirado o es inválido',()=>{
                    signOut({callbackUrl:'/iniciar-session',redirect:true});
                })
            }
            dispatch(setEmpresa(data?.empresa || ""));
            dispatch(setRfcEmpresa(data?.rfc_empresa || ""));
            dispatch(setDireccionEmpresa(data?.direccion_empresa || ""));
            dispatch(setContactoFiscal(data?.contacto_fiscal || ""));
            dispatch(setTelefonoContacto(data?.telefono_contacto || ""));
            dispatch(setRepresentanteLegal(data?.representante_legal || ""));
            dispatch(setEmpleados(data?.empleados || 0));
         })
    }

    useEffect(()=>{
        if(user?.user?.access_token){
            getProfileAsync(user.user.access_token);
        }
    },[user])

    return null;
}