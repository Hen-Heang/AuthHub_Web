"use client"

import type React from "react"
import { useState } from "react"
import {
    Mail,
    Lock,
    ArrowLeft,
    Shield,
    Loader2,
    AlertCircle,
    CheckCircle,
    ArrowRight,
    Clock,
    RefreshCw,
    Inbox,
    Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { requestPasswordReset } from "@/lib/auth-client"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [step, setStep] = useState<"request" | "confirmation">("request")
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)

    const router = useRouter()

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

        setFormErrors(errors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await requestPasswordReset(email)

            if (response.success) {
                setSuccess(true)
                setStep("confirmation")
                // Start cooldown for resend button
                setResendCooldown(60)
                const interval = setInterval(() => {
                    setResendCooldown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.message || "Failed to send password reset link. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (resendCooldown > 0) return

        setLoading(true)
        setError(null)

        try {
            const response = await requestPasswordReset(email)
            if (response.success) {
                setResendCooldown(60)
                const interval = setInterval(() => {
                    setResendCooldown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.message || "Failed to resend reset link. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const securityFeatures = [
        {
            icon: Shield,
            title: "Secure Reset Process",
            description: "Industry-standard password reset flow",
        },
        {
            icon: Mail,
            title: "Email Verification",
            description: "Verified email addresses only",
        },
        {
            icon: Clock,
            title: "Time-Limited Links",
            description: "Links expire after 24 hours",
        },
        {
            icon: Lock,
            title: "Single-Use Tokens",
            description: "Each link can only be used once",
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
                            <Button variant="outline" asChild>
                                <Link href="/sign-in">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Sign In
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Reset Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-md mx-auto lg:mx-0"
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4">
                                {step === "request" ? (
                                    <Lock className="h-8 w-8 text-white" />
                                ) : (
                                    <Inbox className="h-8 w-8 text-white" />
                                )}
                            </div>
                            {step === "request" ? (
                                <>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot your password?</h1>
                                    <p className="text-slate-600">No worries! Enter your email and we'll send you a reset link</p>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Check your email</h1>
                                    <p className="text-slate-600">We've sent a password reset link to your email address</p>
                                </>
                            )}
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
                                            <p className="font-semibold">Request Failed</p>
                                            <p className="text-sm">{error}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {step === "confirmation" && success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-3"
                                    >
                                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold">Reset Link Sent!</p>
                                            <p className="text-sm">Please check your email for the password reset link</p>
                                        </div>
                                    </motion.div>
                                )}

                                {step === "request" ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                                Email Address
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

                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending Reset Link...
                                                </>
                                            ) : (
                                                <>
                                                    Send Reset Link
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>

                                        <div className="text-center">
                                            <p className="text-sm text-slate-600">
                                                Remembered your password?{" "}
                                                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 font-semibold">
                                                    Sign in here
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <Inbox className="h-5 w-5 text-blue-600 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-blue-900 mb-1">Email sent to:</p>
                                                    <p className="text-blue-700 font-mono text-sm bg-blue-100 px-2 py-1 rounded">{email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                                <Search className="h-4 w-4 text-slate-500 mt-0.5" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-slate-700">Can't find the email?</p>
                                                    <p className="text-slate-600">Check your spam folder or search for "SecureAuth"</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                                <Clock className="h-4 w-4 text-slate-500 mt-0.5" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-slate-700">Link expires in 24 hours</p>
                                                    <p className="text-slate-600">For security, reset links have a limited lifetime</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <Button
                                                type="button"
                                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                                onClick={() => router.push("/sign-in")}
                                            >
                                                Return to Sign In
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full h-12"
                                                onClick={handleResend}
                                                disabled={resendCooldown > 0 || loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Resending...
                                                    </>
                                                ) : resendCooldown > 0 ? (
                                                    <>
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        Resend in {resendCooldown}s
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                        Resend Email
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStep("request")
                                                    setSuccess(false)
                                                    setError(null)
                                                }}
                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                            >
                                                Try a different email address
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Trust Indicators */}
                        <div className="mt-8 text-center">
                            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Secure Process</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>No Spam</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>24h Expiry</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Security Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:pl-12 space-y-8"
                    >
                        <div>
                            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                                <Shield className="h-3 w-3 mr-1" />
                                Enterprise Security
                            </Badge>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Secure password recovery</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Our password reset process follows industry best practices to ensure your account remains secure while
                                providing a smooth recovery experience.
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

                        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Security Best Practices</h3>
                                    <p className="text-amber-100">Keep your account safe</p>
                                </div>
                            </div>
                            <div className="space-y-3 text-amber-100">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm">Never share reset links with others</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm">Use the link within 24 hours</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm">Choose a strong, unique password</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm">Enable two-factor authentication</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <Button variant="outline" asChild className="bg-white hover:bg-slate-50">
                                <Link href="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Home
                                </Link>
                            </Button>
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
