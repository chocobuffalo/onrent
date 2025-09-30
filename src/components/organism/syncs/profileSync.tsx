// src/components/organism/syncs/profileSync.tsx
'use client';

import { useToast } from "@/hooks/frontend/ui/useToast";
import {
    setAvatar,
    setConstanciaPDF,
    setContactoFiscal,
    setDireccionEmpresa,
    setDireccionFiscal,
    setEmpleados,
    setEmpresa,
    setName,
    setPhone,
    setRazonSocial,
    setRepresentanteLegal,
    setRFC,
    setRfcEmpresa,
    setTelefonoContacto,
    setOperatorName,
    setOperatorPhone,
    setLicenseType,
    setExperienceYears,
} from "@/libs/redux/features/auth/authSlicer";
import { useUIAppDispatch } from "@/libs/redux/hooks";
import { getCompanyInfo } from "@/services/getCompanyInfo";
import { getFiscalInfo } from "@/services/getFiscalInfo";
import getProfile from "@/services/getProfile";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ProfileSync() {
    const dispatch = useUIAppDispatch();
    const { toastCritical } = useToast();
    const { data: user } = useSession();

    const handleSessionExpired = () => {
        signOut({ callbackUrl: '/iniciar-session', redirect: true });
    };

    const getProfileAsync = async (token: string) => {
        getProfile(token).then((data) => {
            dispatch(setName(data.name || ""));
            dispatch(setPhone(data.phone || ""));
            dispatch(setAvatar(data.image_base64 ? `data:image/jpeg;base64,${data.image_base64}` : "/profile-placeholder.svg"));
            
            // Sincronizar información del operador
            dispatch(setOperatorName(data.operator_name || ""));
            dispatch(setOperatorPhone(data.operator_phone || ""));
            dispatch(setLicenseType(data.license_type || ""));
            dispatch(setExperienceYears(data.experience_years || 0));
        });

        getFiscalInfo(token).then((data) => {
            dispatch(setConstanciaPDF(data.constancia_pdf || ""));
            dispatch(setDireccionFiscal(data.direccion_fiscal || ""));
            dispatch(setRazonSocial(data.razon_social || ""));
            dispatch(setRFC(data.rfc || ""));
        });

        getCompanyInfo(token).then((data) => {
            if (data === null) {
                console.log("No se pudo obtener la información de la empresa, forzando logout");
                toastCritical('Tu sesión ha expirado. Por favor, inicia sesión nuevamente');
                
                setTimeout(() => {
                    handleSessionExpired();
                }, 5000);
            } else {
                dispatch(setEmpresa(data?.empresa || ""));
                dispatch(setRfcEmpresa(data?.rfc_empresa || ""));
                dispatch(setDireccionEmpresa(data?.direccion_empresa || ""));
                dispatch(setContactoFiscal(data?.contacto_fiscal || ""));
                dispatch(setTelefonoContacto(data?.telefono_contacto || ""));
                dispatch(setRepresentanteLegal(data?.representante_legal || ""));
                dispatch(setEmpleados(data?.empleados || 0));
            }
        });
    };

    useEffect(() => {
        if (user?.user?.access_token) {
            getProfileAsync(user.user.access_token);
        }
    }, [user]);

    return null;
}