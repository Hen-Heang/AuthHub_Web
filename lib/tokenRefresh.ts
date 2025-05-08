import {post} from "@/service/auth/auth.service";


interface RefreshTokenResponse {
    data: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }
}

/**
 * Refreshes the access token using the refresh token
 * @returns A promise that resolves to the new tokens if successful
 */
export async function refreshAccessToken(): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
} | null> {
    try {
        // Get the refresh token from storage
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        // Send refresh token to server
        const response = await post<RefreshTokenResponse>(
            '/auth/refresh',
            { refreshToken },
            { includeAuth: false } // Don't include the expired access token
        );

        // Update tokens in localStorage
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            expiresIn: response.data.expiresIn
        };
    } catch (error) {
        console.error('Failed to refresh token:', error);

        // Clear all auth data on refresh failure
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        return null;
    }
}

/**
 * Setup auto token refresh before expiration
 * @param expiresIn Expiration time in seconds
 */
export function setupTokenRefresh(expiresIn: number): void {
    if (typeof window === 'undefined') return;

    // Clear any existing refresh timers
    const existingTimerId = window.localStorage.getItem('refreshTimerId');
    if (existingTimerId) {
        window.clearTimeout(Number(existingTimerId));
    }

    // Set up a timer to refresh the token before it expires
    // Refresh 1 minute before expiration or at half the expiration time, whichever is smaller
    const refreshTime = Math.min(expiresIn * 1000 - 60000, expiresIn * 500);

    if (refreshTime <= 0) return;

    const timerId = window.setTimeout(async () => {
        const newTokens = await refreshAccessToken();
        if (newTokens) {
            setupTokenRefresh(newTokens.expiresIn);
        }
    }, refreshTime);

    // Store the timer ID in case we need to clear it later
    window.localStorage.setItem('refreshTimerId', timerId.toString());
}