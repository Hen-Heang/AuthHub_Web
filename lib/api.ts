import axios from "axios";

const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
});

// get all posts data
export const getPosts = async () => {
    const response = await api.get('/posts');
    return response.data;
}

// Get users data
export const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
}

// Delete Post
export const deletePost = async (id: number) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
}

// Get comments data
export const getComments = async () => {
    const response = await api.get('/comments');
    return response.data;
}