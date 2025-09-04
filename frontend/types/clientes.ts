export interface Address {
    zip_code?: string;
    street: string;
    neighborhood: string;
    number: string;
    state: string;
    city?: string;
    complement?: string;
}

export interface Cliente {
    id: string;
    tenantId: string;
    publicId: string;
    email: string;
    name: string;
    isActive: boolean;
    contact: string;
    address: Address;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClienteMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ClientesResponse {
    data: Cliente[];
    meta: ClienteMeta;
}
