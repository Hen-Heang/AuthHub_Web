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

/**
 * Request password reset for a specific email
 * Useful for debugging password reset issues
 */
export async function  requestPasswordReset(email: string): Promise<{
    success: boolean,
    message: string
}> {
    try {
        // Attempt to request password reset
        await apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: { email },
            includeAuth: false
        });

        return {
            success: true,
            message: 'Password reset request successful'
        };
    } catch (error: any) {
        return {
            success: false,
            message: `Password reset request failed: ${error.message}`
        };
    }

/*
 * Validate the password reset token
 * Useful for debugging password reset token validation issues
 */
}


export async function validatePasswordResetToken(token: string): Promise<{
    success: boolean,
    message: string
}> {
    try {
        // Attempt to validate the password reset token
        await apiRequest(`/auth/reset-password?token=${token}`, {
            method: 'GET',
            includeAuth: false
        });

        return {
            success: true,
            message: 'Password reset token is valid'
        };
    } catch (error: any) {
        return {
            success: false,
            message: `Password reset token validation failed: ${error.message}`
        };
    }

}


/**
 * Reset the password using the token
 * Useful for debugging password reset issues
 */

export async function resetPassword(token: string, newPassword: string): Promise<{
    success: boolean,
    message: string
}> {
    try {
        // Attempt to reset the password
        await apiRequest('/auth/reset-password', {
            method: 'POST',
            body: { token, newPassword },
            includeAuth: false
        });

        return {
            success: true,
            message: 'Password reset successful'
        };
    } catch (error: any) {
        return {
            success: false,
            message: `Password reset failed: ${error.message}`
        };
    }
}