export interface AuthStateInterface {
    isLogin: boolean;
    profile: {
        name: string;
        email: string;
        avatarUrl: string;
        role: string;
        userID:string;
        token: string;
        phone: string;
        profileInfo:ProfileInfo;
        companyInfo:CompanyInterface;
    };
}

export interface ProfileInfo {
  constancia_pdf:"",
  direccion_fiscal:"",
  razon_social:"",
  rfc:""
}


export interface CompanyInterface{
    empresa: string;
    rfc_empresa: string;
    direccion_empresa: string;
    contacto_fiscal:  string;
    telefono_contacto:  string;
    representante_legal:  string;
    empleados: number;
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
