"use client"

import type React from "react"
import { useState } from "react"
import {
    Lock,
    Mail,
    KeyRound,
    Shield,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff,
    CheckCircle,
    ArrowRight,
    Fingerprint,
    Globe,
    Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function SignInPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [isGithubLoading, setIsGithubLoading] = useState(false)

    const { login, loading, error } = useAuth()

    const validateForm = () => {
        const errors: { [key: string]: string } = {}
        let isValid = true

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            errors.email = "Email is required"
            isValid = false
        } else if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email address"
            isValid = false
        }

        if (!password) {
            errors.password = "Password is required"
            isValid = false
        }

        setFormErrors(errors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            await login(email, password)
        } catch (err) {
            console.error("Login error:", err)
        }
    }

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        // Simulate OAuth flow
        setTimeout(() => setIsGoogleLoading(false), 2000)
    }

    const handleGithubLogin = async () => {
        setIsGithubLoading(true)
        // Simulate OAuth flow
        setTimeout(() => setIsGithubLoading(false), 2000)
    }

    const securityFeatures = [
        {
            icon: Shield,
            title: "256-bit Encryption",
            description: "Military-grade security",
        },
        {
            icon: Fingerprint,
            title: "Biometric Support",
            description: "Touch ID & Face ID ready",
        },
        {
            icon: Globe,
            title: "Global Infrastructure",
            description: "99.9% uptime guarantee",
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Sub-100ms response time",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SecureAuth
              </span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-600">New to SecureAuth?</span>
                            <Button variant="outline" asChild>
                                <Link href="/sign-up">Create Account</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Sign In Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-md mx-auto lg:mx-0"
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4">
                                <Lock className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
                            <p className="text-slate-600">Sign in to your secure account</p>
                        </div>

                        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                            <CardContent className="p-8">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3"
                                    >
                                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">Authentication failed</p>
                                            <p className="text-sm">{error}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                            Email address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@company.com"
                                                className={`pl-10 h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                                                    formErrors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                                                }`}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        {formErrors.email && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-red-500 text-sm flex items-center gap-1"
                                            >
                                                <AlertCircle className="h-3 w-3" />
                                                {formErrors.email}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                                Password
                                            </Label>
                                            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••••"
                                                className={`pl-10 pr-10 h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                                                    formErrors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                                                }`}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {formErrors.password && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-red-500 text-sm flex items-center gap-1"
                                            >
                                                <AlertCircle className="h-3 w-3" />
                                                {formErrors.password}
                                            </motion.p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                Sign in securely
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>

                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="bg-white px-4 text-slate-500 font-medium">Or continue with</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="h-12 border-slate-200 hover:bg-slate-50"
                                            onClick={handleGoogleLogin}
                                            disabled={isGoogleLoading}
                                        >
                                            {isGoogleLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
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
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="h-12 border-slate-200 hover:bg-slate-50"
                                            onClick={handleGithubLogin}
                                            disabled={isGithubLoading}
                                        >
                                            {isGithubLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                                                        <path
                                                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12"
                                                            fill="#24292F"
                                                        />
                                                    </svg>
                                                    GitHub
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-8 text-center">
                                    <p className="text-sm text-slate-600">
                                        Don&#39;t have an account?{" "}
                                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 font-semibold">
                                            Create one now
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trust Indicators */}
                        <div className="mt-8 text-center">
                            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>SSL Secured</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>GDPR Compliant</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>SOC 2 Certified</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Security Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:pl-12"
                    >
                        <div className="space-y-8">
                            <div>
                                <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Enterprise Security
                                </Badge>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Bank-grade security for your peace of mind</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Your data is protected by the same security standards used by financial institutions. We implement
                                    multiple layers of protection to keep your information safe.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                {securityFeatures.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                        className="flex items-start gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200/50"
                                    >
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <feature.icon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                                            <p className="text-sm text-slate-600">{feature.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Lock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Zero Trust Architecture</h3>
                                        <p className="text-blue-100">Never trust, always verify</p>
                                    </div>
                                </div>
                                <p className="text-blue-100 leading-relaxed">
                                    Every request is authenticated, authorized, and encrypted. Our zero-trust model ensures that your data
                                    remains secure even if other systems are compromised.
                                </p>
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">99.99%</div>
                                        <div className="text-sm text-blue-200">Uptime SLA</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">256-bit</div>
                                        <div className="text-sm text-blue-200">AES Encryption</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-lg">SecureAuth</span>
                                <p className="text-sm text-slate-400">Enterprise-grade security</p>
                            </div>
                        </div>
                        <div className="text-sm text-slate-400">
                            &copy; {new Date().getFullYear()} SecureAuth. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
