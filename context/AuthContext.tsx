'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import { setupTokenRefresh } from '@/lib/tokenRefresh'
import {get, post} from "@/service/auth/auth.service";

export interface User {
    id?: number
    name: string
    email: string
    emailVerified?: boolean
    imageUrl?: string
    provider?: string
}

interface AuthResponse {
    accessToken: string
    refreshToken: string
    tokenType: string
    expiresIn: number
}

export interface AuthContextType {
    user: User | null
    token: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    fetchCurrentUser: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Fetch current user data from the API
    const fetchCurrentUser = async (): Promise<User | null> => {
        try {
            const response = await get<{ data: User }>('/auth/user')
            const userData = response.data

            // Update user state and localStorage
            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))

            return userData
        } catch (error) {
            console.error('Failed to fetch user data:', error)
            return null
        }
    }

    // Check if the user is logged in on an initial load
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const storedToken = localStorage.getItem('token')
                const storedRefreshToken = localStorage.getItem('refreshToken')
                const storedUser = localStorage.getItem('user')

                if (storedToken && storedRefreshToken) {
                    setToken(storedToken)
                    setRefreshToken(storedRefreshToken)

                    if (storedUser) {
                        // Set the stored user data initially
                        setUser(JSON.parse(storedUser))

                        // Then try to fetch fresh user data from the API
                        await fetchCurrentUser()
                    }
                }
            } catch (error) {
                console.error('Failed to restore auth state:', error)
            } finally {
                setLoading(false)
            }
        }

        checkAuthStatus()
    }, [])

    const handleAuthSuccess = async (authResponse: AuthResponse) => {
        // Set tokens in state
        setToken(authResponse.accessToken)
        setRefreshToken(authResponse.refreshToken)

        // Store tokens in localStorage
        localStorage.setItem('token', authResponse.accessToken)
        localStorage.setItem('refreshToken', authResponse.refreshToken)

        // Setup token refresh
        setupTokenRefresh(authResponse.expiresIn)

        // Fetch and set user data
        await fetchCurrentUser()
    }

    const login = async (email: string, password: string) => {
        try {
            setLoading(true)
            setError(null)

            const response = await post<{ data: AuthResponse }>('/auth/login', { email, password }, { includeAuth: false })

            await handleAuthSuccess(response.data)

            // Redirect to dashboard
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'An error occurred during login')
            console.error('Login error:', err)
        } finally {
            setLoading(false)
        }
    }

    const signup = async (name: string, email: string, password: string) => {
        try {
            setLoading(true)
            setError(null)

            const response = await post<{ data: AuthResponse }>('/auth/signup', { name, email, password }, { includeAuth: false })

            await handleAuthSuccess(response.data)

            // Redirect to dashboard
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup')
            console.error('Signup error:', err)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            // If we have a refresh token, send it to the server to revoke it
            if (refreshToken) {
                await post('/auth/logout', { refreshToken })
            }
        } catch (error) {
            console.error('Error during logout:', error)
        } finally {
            // Clear state regardless of server response
            setUser(null)
            setToken(null)
            setRefreshToken(null)

            // Clear localStorage
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')

            // Remove any refresh token timer
            const refreshTimerId = localStorage.getItem('refreshTimerId')
            if (refreshTimerId) {
                clearTimeout(Number(refreshTimerId))
                localStorage.removeItem('refreshTimerId')
            }

            // Redirect to home
            router.push('/')
        }
    }

    const value = {
        user,
        token,
        refreshToken,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        signup,
        logout,
        fetchCurrentUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}