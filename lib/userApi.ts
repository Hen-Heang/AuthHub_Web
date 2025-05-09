// lib/api/userApi.ts
import {del, get, patch, put} from '@/service/auth/auth.service';

export interface User {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    imageUrl?: string;
    provider: string;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    imageUrl?: string;
    emailVerified?: boolean;
}

export const userApi = {
    updateUser: async (id: number, updateData: UpdateUserRequest): Promise<User> => {
        const response = await patch(`/users/${id}`, updateData);
        return response.data;
    },

    deleteUser: async (id: number): Promise<void> => {
        await del(`/users/${id}`);
    }
};