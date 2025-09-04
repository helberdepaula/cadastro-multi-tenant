import { Cliente, ClientesResponse } from "@/types/clientes";
import requestApi from ".";


const ENDPOINT = "clientes";

export const ClientesService = {

    async list(filters: any = {}): Promise<ClientesResponse> {
        const params = {
            name: filters.name || '',
            email: filters.email || '',
            page: filters.page || 1,
            perPage: filters.perPage || 10,
        };
        const response = await requestApi.get(ENDPOINT, { params });
        return response as unknown as ClientesResponse;
    },

    async get(id: string): Promise<Cliente> {
        const response = await requestApi.get(`${ENDPOINT}/${id}`);
        return response as unknown as Cliente;
    },

    async create(data: any): Promise<Cliente> {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        
        const response = await requestApi.post(ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response as unknown as Cliente;
    },

    async update(id: string, data: any): Promise<Cliente> {
        const formData = new FormData();
        
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        
        const response = await requestApi.put(`${ENDPOINT}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response as unknown as Cliente;
    },

    async delete(id: string): Promise<void> {
        await requestApi.delete(`${ENDPOINT}/${id}`);
    },
};
