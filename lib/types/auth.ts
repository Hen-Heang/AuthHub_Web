export interface SignupRequest {
    email: string;
    password: string;
    name: string;
}

export interface SignupResponse {
    id: number;
    email: string;
    name: string;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}