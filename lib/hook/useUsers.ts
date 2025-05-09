import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {get} from "@/service/auth/auth.service";
import {UpdateUserRequest, userApi} from "../userApi";
import toast from "react-hot-toast";

export interface User{
    id : number;
    name : string;
    email : string;
    emailVerified : boolean;
    imageUrl ? : string;
    provider : string;
}

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await get('/users');
            return response.data as User[];
        },
        refetchOnWindowFocus: false,
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updateData }: { id: number; updateData: UpdateUserRequest }) =>
            userApi.updateUser(id, updateData),
        onSuccess: (data) => {
            // Invalidate and refetch users list
            queryClient.invalidateQueries({ queryKey: ['users'] });
            // Update the specific user in the cache
            queryClient.setQueryData(['users', data.id], data);
            toast.success('User updated successfully');
        },
        onError: (error: any) => {
            toast.error(`Error updating user: ${error.message}`);
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => userApi.deleteUser(id),
        onSuccess: () => {
            // Invalidate and refetch users list
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deleted successfully');
        },
        onError: (error: any) => {
            toast.error(`Error deleting user: ${error.message}`);
        },
    });
}