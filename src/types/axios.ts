export interface AxiosInfoInterface {
    baseURL?: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    params?: Record<string, string>;
    timeout?: number; 
}

// Opciones para crear instancia de Axios
export interface CreateAxiosInstanceOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}