import { Usuario, UsuariosResponse } from "@/types/usuarios";
import requestApi from ".";
import { email } from "zod";


const ENDPOINT = "users";

export const UsuariosService = {

    async list(filters: any = {}): Promise<UsuariosResponse> {
        const params = {
            name: filters.name || '',
            email: filters.email || '',
            patientId: filters.patientId || '',
            page: filters.page || 1,
            perPage: filters.perPage || 10,
        };
        const response = await requestApi.get(ENDPOINT, { params });
        return response as unknown as UsuariosResponse;
    },

    async get(id: string): Promise<Usuario> {
        const response = await requestApi.get(`${ENDPOINT}/${id}`);
        return response as unknown as Usuario;
    },

    async create(data: any): Promise<Usuario> {
        const response = await requestApi.post(ENDPOINT, data);
        return response as unknown as Usuario;
    },

    async update(id: string, data: any): Promise<Usuario> {
        const response = await requestApi.put(`${ENDPOINT}/${id}`, data);
        return response as unknown as Usuario;
    },

    async delete(id: string): Promise<void> {
        await requestApi.delete(`${ENDPOINT}/${id}`);
    },
};
