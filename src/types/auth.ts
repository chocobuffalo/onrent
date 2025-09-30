// src/types/auth.ts
export interface AuthStateInterface {
    isLogin: boolean;
    profile: {
        odoo_partner_id: any;
        name: string;
        email: string;
        avatarUrl: string;
        role: string;
        userID: string;
        token: string;
        phone: string;
        profileInfo: ProfileInfo;
        companyInfo: CompanyInterface;
        operatorInfo: OperatorInfo; // NUEVO
    };
}

export interface ProfileInfo {
    constancia_pdf: string;
    direccion_fiscal: string;
    razon_social: string;
    rfc: string;
}

export interface CompanyInterface {
    empresa: string;
    rfc_empresa: string;
    direccion_empresa: string;
    contacto_fiscal: string;
    telefono_contacto: string;
    representante_legal: string;
    empleados: number;
}

// NUEVA INTERFAZ
export interface OperatorInfo {
    operator_name: string;
    operator_phone: string;
    license_type: string;
    experience_years: number;
}

export interface LoginResponse {
    message: string;
    access_token: string;
    token_type: string;
    user: {
        user_id: number;
        email: string;
        name: string;
        role: string;
    };
}

export interface LoginPayload {
    email: string;
    password: string;
}