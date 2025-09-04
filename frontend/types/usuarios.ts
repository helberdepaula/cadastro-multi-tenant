export interface UserPayload {

}

export interface Usuario {
    id: string;
    tenantId: string;
    email: string;
    password: string;
    name: string;
    role: 'ADMIN' | 'USER' | 'GUEST';
    refreshToken: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

export interface UsuariosMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UsuariosResponse {
    data: Usuario[];
    meta: UsuariosMeta;
}