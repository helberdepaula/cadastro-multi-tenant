export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}

export interface payloadAuth {
    email: string;
    password: string;
}

export interface RefreshTokenPayload {
    refreshToken: string;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: 'ADMIN' | 'USER' | 'GUEST';
}

export type UserRole = 'ADMIN' | 'USER' | 'GUEST';