export interface AxiosInfoInterface {
    baseURL?: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    params?: Record<string, string>;
    timeout?: number; 
}