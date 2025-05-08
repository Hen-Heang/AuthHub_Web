import {refreshAccessToken} from "@/lib/tokenRefresh";

const API_URL = 'http://localhost:8000/api';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiOptions {
    method?: RequestMethod;
    body?: any;
    headers?: Record<string, string>;
    includeAuth?: boolean;
    retryWithRefresh?: boolean;
}

/**
 * Make an API request to the backend
 * @param endpoint The API endpoint (without the base URL)
 * @param options Request options
 * @param retryCount
 * @returns Promise with the response data
 */

export async function apiRequest<T = any>(
    endpoint: string,
    options: ApiOptions = {},
    retryCount: number = 0
): Promise<T> {
    const {
        method = 'GET',
        body,
        headers = {},
        includeAuth = true,
        retryWithRefresh = true
    } = options;

    // Get token from localStorage if we're including auth and in a browser environment
    let token = null;
    if (typeof window !== 'undefined' && includeAuth) {
        token = localStorage.getItem('token');
    }

    // Prepare headers
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    // Add auth header if token exists
    if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
        method,
        headers: requestHeaders,
    };

    // Add body for non-GET requests if it exists
    if (method !== 'GET' && body !== undefined) {
        fetchOptions.body = JSON.stringify(body);
    }

    try {
        // Make the request
        const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');

        // Parse the response
        let data;
        if (isJson) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        // Handle unauthorized response (token might be expired)
        if (response.status === 401 && retryWithRefresh && retryCount === 0) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                // Retry the request with the new token
                // Get the new token from localStorage
                const newToken = localStorage.getItem('token');
                // Create new options with updated headers to include the new token
                const updatedOptions = {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${newToken}`
                    }
                };
                return apiRequest(endpoint, updatedOptions, retryCount + 1);
            }
        }

        // Handle error responses
        if (!response.ok) {
            // Extract error message from the response if possible
            let errorMessage = 'Request failed';

            if (isJson) {
                // Handle Spring Boot structured error response
                if (data.status && data.message) {
                    errorMessage = data.message;
                }
                // Handle our custom API response format
                else if (data.statusCode && data.statusCode.message) {
                    errorMessage = data.statusCode.message;
                }
                // Try to extract from data field if it contains an error message
                else if (data.data && typeof data.data === 'string') {
                    errorMessage = data.data;
                }
                // For general error message from the response
                else if (data.message) {
                    errorMessage = data.message;
                }
                // For error message in error field
                else if (data.error) {
                    errorMessage = data.error;
                }
            }

            throw new Error(errorMessage);
        }

        return data;
    } catch (error: any) {
        // Handle network errors
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
        }

        // Handle 401 Unauthorized errors (token expired)
        if (error.message === 'Unauthorized' && retryWithRefresh && retryCount === 0) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                // Retry the request with the new token
                // Get the new token from localStorage
                const newToken = localStorage.getItem('token');
                // Create new options with updated headers to include the new token
                const updatedOptions = {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${newToken}`
                    }
                };
                return apiRequest(endpoint, updatedOptions, retryCount + 1);
            }
        }

        // Re-throw the error to be handled by the caller
        throw error;
    }
}

/**
 * Make a GET request
 */
export function get<T = any>(endpoint: string, options: Omit<ApiOptions, 'method' | 'body'> = {}): Promise<T> {
    return apiRequest<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * Make a POST request
 */
export function post<T = any>(endpoint: string, body: any, options: Omit<ApiOptions, 'method' | 'body'> = {}): Promise<T> {
    return apiRequest<T>(endpoint, { ...options, method: 'POST', body });
}

/**
 * Make a PUT request
 */
export function put<T = any>(endpoint: string, body: any, options: Omit<ApiOptions, 'method' | 'body'> = {}): Promise<T> {
    return apiRequest<T>(endpoint, { ...options, method: 'PUT', body });
}

/**
 * Make a DELETE request
 */
export function del<T = any>(endpoint: string, options: Omit<ApiOptions, 'method'> = {}): Promise<T> {
    return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * Make a PATCH request
 */
export function patch<T = any>(endpoint: string, body: any, options: Omit<ApiOptions, 'method' | 'body'> = {}): Promise<T> {
    return apiRequest<T>(endpoint, { ...options, method: 'PATCH', body });
}
