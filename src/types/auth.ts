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
    };
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
