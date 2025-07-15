import { AxiosInfoInterface } from "@/types/axios";
import axios from "axios";

export default async function createAxiosinstance(axiosInfo:AxiosInfoInterface){
    const instance = axios.create({
        baseURL: axiosInfo.baseURL||process.env.NEXT_PUBLIC_API_URL,
        headers: axiosInfo.headers||{
            'Content-Type': 'application/json',
        },
        timeout:10000,
    });

    instance.interceptors.request.use((config) => {
        // Agregar lógica antes de enviar la solicitud
        return config;
    });

    instance.interceptors.response.use(
        (response) => {
            // Manejar la respuesta exitosa
            return response;
        },
        (error) => {
            // Manejar errores
            return Promise.reject(error);
        }
    );

    return instance;
}
