// src/services/loginUser.ts
import { LoginPayload, LoginResponse } from "@/types/auth";
import createAxiosinstance from "@/utils/axiosInstance";


export default async function loginUser(credentials: LoginPayload): Promise<LoginResponse> {
  try {
    const axiosInstance = await createAxiosinstance({
      baseURL: process.env.NEXT_PUBLIC_API_URL_ORIGIN,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await axiosInstance.post<LoginResponse>('/api/user/login', {
      email: credentials.email,
      password: credentials.password,
    });

    console.log('✅ Login response:', response.data);
    return response.data;

  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    
    if (error.response?.status === 401) {
      throw new Error('Credenciales inválidas');
    }
    
    throw new Error('Error de conexión con el servidor');
  }
}