import { Usuario, UsuariosResponse } from "@/types/usuarios";
import requestApi from ".";
import { AuthResponse, payloadAuth, RefreshTokenPayload } from "@/types/auth";


const ENDPOINT = "auth";

export const AuthService = {

    async login(data: payloadAuth): Promise<AuthResponse> {
        const response = await requestApi.post(`${ENDPOINT}/login`, data);
        return response as unknown as AuthResponse;
    },

    async refresh(data: RefreshTokenPayload): Promise<AuthResponse> {
        const response = await requestApi.patch(`${ENDPOINT}/refresh`, data);
        return response as unknown as AuthResponse;
    },

    async delete(id: string): Promise<void> {
        await requestApi.delete(`${ENDPOINT}/${id}`);
    },
};
