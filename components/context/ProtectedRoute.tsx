'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
    children: ReactNode
}

/**
 * A component that protects routes requiring authentication
 * Redirects to sign-in page if not authenticated
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // If not loading and not authenticated, redirect to sign-in
        if (!loading && !isAuthenticated) {
            router.push('/sign-in')
        }
    }, [loading, isAuthenticated, router])

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800">Loading...</h3>
                </div>
            </div>
        )
    }

    // If not authenticated, don't render the children (we're redirecting)
    if (!isAuthenticated) {
        return null
    }

    // If authenticated, render the children
    return <>{children}</>
}