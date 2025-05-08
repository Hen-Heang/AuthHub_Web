"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, User, KeyRound, Shield, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import DebugConnection from "@/components/DebugConnection";

export default function SignUpPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

    const { signup, loading, error } = useAuth()

    // Validate form fields
    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        let isValid = true;

        // Validate name
        if (!name.trim()) {
            errors.name = "Name is required";
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email address";
            isValid = false;
        }

        // Validate password
        if (!password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters";
            isValid = false;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords don't match";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Clear previous errors
        setPasswordError("")

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Call signup from auth context
        try {
            await signup(name, email, password)
        } catch (err) {
            console.error("Signup error:", err);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-slate-800">Sign Up Page</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card className="shadow-md border-slate-200">
                            <CardHeader className="pb-4">
                                <div className="flex justify-center mb-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-indigo-600" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-center text-slate-900">Create your account</h2>
                                <p className="text-sm text-center text-slate-500">Sign up to get started with OAuth 2.0</p>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-start gap-2">
                                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Registration failed</p>
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                className={`pl-10 ${formErrors.name ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        {formErrors.name && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className={`pl-10 ${formErrors.email ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        {formErrors.email && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className={`pl-10 ${formErrors.password ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        {formErrors.password && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                                        )}
                                        <p className="text-xs text-slate-500">
                                            Password must be at least 8 characters long
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                className={`pl-10 ${formErrors.confirmPassword ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                        {formErrors.confirmPassword && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </Button>

                                    <div className="relative my-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-2 text-slate-500">Or sign up with</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                                <path
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    fill="#EA4335"
                                                />
                                            </svg>
                                            Google
                                        </Button>
                                        <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                                <path
                                                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                                    fill="#24292F"
                                                />
                                            </svg>
                                            GitHub
                                        </Button>
                                    </div>

                                    <div className="text-center text-sm mt-6">
                                        <p className="text-slate-600">
                                            Already have an account?{" "}
                                            <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </form>

                                {/* Add debugging component */}
                                <DebugConnection
                                    name={name}
                                    email={email}
                                    password={password}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center"
                    >
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl p-8 h-full w-full flex flex-col items-center justify-center text-white shadow-lg">
                            <Shield className="h-16 w-16 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Join Our Secure Platform</h3>
                            <p className="text-indigo-100 text-center mb-6">
                                Create an account to access all the features of our OAuth 2.0 implementation.
                            </p>
                            <div className="mt-4 grid gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                                    <span className="text-sm text-indigo-100">Secure authentication</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                                    <span className="text-sm text-indigo-100">Multiple login options</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                                    <span className="text-sm text-indigo-100">Personal dashboard</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                                    <span className="text-sm text-indigo-100">Data protection</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="bg-transparent border-white text-white hover:bg-indigo-700"
                                >
                                    <Link href="/">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Home
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}