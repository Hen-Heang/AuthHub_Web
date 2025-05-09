// app/profile/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Loader2, Shield } from "lucide-react"
import Link from "next/link"
import UserProfileForm from "@/components/ui/UserProfileForm"
import { Toaster } from 'react-hot-toast'

export default function ProfilePage() {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // If not loading and not authenticated, redirect to sign-in
        if (!loading && !isAuthenticated) {
            router.push("/sign-in")
        }
    }, [loading, isAuthenticated, router])

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800">Loading profile...</h3>
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
            <Toaster position="top-right" />
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
                        <Link href="/users" className="text-white hover:text-indigo-100">
                            Users
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-12 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
                    <p className="text-slate-600 mt-2">
                        Update your personal information and preferences
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <UserProfileForm />
                    </div>
                    <div>
                        <div className="bg-white rounded-lg p-6 shadow border h-full">
                            <h2 className="text-xl font-bold mb-4">Account Information</h2>
                            <p className="text-slate-600 mb-6">
                                This section displays additional information about your account. Your data is securely stored and protected.
                            </p>

                            <div className="space-y-4">
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <h3 className="font-medium text-indigo-700 mb-2">Account Security</h3>
                                    <p className="text-sm text-slate-600">
                                        Your account is protected with OAuth 2.0 authentication. For enhanced security, we recommend regularly reviewing your account activity.
                                    </p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <h3 className="font-medium text-slate-700 mb-2">Data Privacy</h3>
                                    <p className="text-sm text-slate-600">
                                        We respect your privacy and only collect essential information. You have the right to request all data associated with your account at any time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-slate-900 text-white py-6 mt-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <Shield className="h-5 w-5 text-indigo-400" />
                            <span className="font-semibold">OAuth Demo App</span>
                        </div>
                        <div className="text-sm text-slate-400">
                            &copy; {new Date().getFullYear()} OAuth Demo. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}