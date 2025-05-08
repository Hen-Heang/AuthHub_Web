// Frontend API client for debugging purposes


import {apiRequest} from "@/service/auth/auth.service";

/**
 * Test the API connection with a simple ping request
 * This can be used to diagnose CORS or other API connection issues
 */
export async function testApiConnection(): Promise<{ success: boolean, message: string }> {
    try {
        // Simple GET request to test connection
        await apiRequest('/public/ping', { includeAuth: false });
        return { success: true, message: 'Successfully connected to the API' };
    } catch (error: any) {
        return {
            success: false,
            message: `Failed to connect to the API: ${error.message}`
        };
    }
}

/**
 * Test authentication with specific credentials
 * Useful for debugging login issues
 */
export async function testAuthentication(email: string, password: string): Promise<{
    success: boolean,
    message: string,
    details?: any
}> {
    try {
        // Attempt to log in with the provided credentials
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: { email, password },
            includeAuth: false
        });

        return {
            success: true,
            message: 'Authentication successful',
            details: response
        };
    } catch (error: any) {
        return {
            success: false,
            message: `Authentication failed: ${error.message}`
        };
    }
}

/**
 * Test registration with specific details
 * Useful for debugging signup issues
 */
export async function testRegistration(name: string, email: string, password: string): Promise<{
    success: boolean,
    message: string,
    details?: any
}> {
    try {
        // Attempt to register with the provided details
        const response = await apiRequest('/auth/signup', {
            method: 'POST',
            body: { name, email, password },
            includeAuth: false
        });

        return {
            success: true,
            message: 'Registration successful',
            details: response
        };
    } catch (error: any) {
        console.error('Registration error:', error);
        return {
            success: false,
            message: `Registration failed: ${error.message}`
        };
    }
}