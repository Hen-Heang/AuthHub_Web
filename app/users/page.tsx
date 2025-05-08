
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Loader2, Shield } from "lucide-react"
import Link from "next/link"
import UserList from "@/components/UserList";

export default function UsersPage() {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // If not loading and not authenticated, redirect to sign-in
        if (!loading && !isAuthenticated) {
            router.push("/sign-in")
        }
    }, [loading, isAuthenticated, router])

    // Show loading state while checking authentications
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800">Loading user data...</h3>
                </div>
            </div>
        )
    }

    // If not authenticated, don't render the dashboard (we're redirecting)
    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-indigo-600 text-white sticky top-0 z-10 shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6" />
                        <Link href="/" className="font-bold text-xl">OAuth Demo App</Link>
                    </div>
                    <div className="flex space-x-4">
                        <Link href="/dashboard" className="text-white hover:text-indigo-100">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-12 px-4">
                <UserList />
            </main>

            <footer className="bg-amber-200 text-black py-6 mt-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <Shield className="h-5 w-5 text-indigo-400" />
                            <span className="font-semibold">OAuth Demo App</span>
                        </div>
                        <div className="text-sm text-black">
                            &copy; {new Date().getFullYear()} OAuth Demo. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}