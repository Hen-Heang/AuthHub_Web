export interface Post {
    id: number;
    tiltle: string;
    body: string;
    userId: number;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
}

export interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

export interface CreatePostInput {
    title: string;
    body: string;
    userId: number;
}

export interface UpdatePostInput {
    id: number;
    title: string;
    body: string;
    userId: number;
}

