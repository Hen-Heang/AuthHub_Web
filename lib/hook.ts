import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import *as api from './api';
import {id} from "postcss-selector-parser";

export function usePosts() {
    return useQuery({
        queryKey: ['posts'],
        queryFn: api.getPosts,
    })
}

// Get user

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: api.getUsers,
    })
}

// Delete Post
export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => api.deletePost(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['posts', id] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
}

// Get comments
export function useComments() {
    return useQuery({
        queryKey: ['comments'],
        queryFn: api.getComments,
    })
}