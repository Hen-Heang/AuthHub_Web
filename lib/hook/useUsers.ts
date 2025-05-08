import {useQuery} from "@tanstack/react-query";
import {get} from "@/service/auth/auth.service";

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