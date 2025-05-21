"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Lock, ArrowLeft, Shield, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {requestPasswordReset} from "@/lib/auth-client";

export default function Page() {
    const [email, setEmail] = useState("")
    const [step, setStep] = useState<"request" | "confirmation">("request")
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const router = useRouter()

    // Validate form field
    const validateForm = () => {
        const errors: {[key: string]: string} = {}
        let isValid = true

        // Validate email
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

        // Validate form
        if (!validateForm()) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Mock API call - In a real application, you would call your password reset API
            // await new Promise(resolve => setTimeout(resolve, 1500))
            const response = await requestPasswordReset(email)
            // Handle successful submission
            if (response.success){
                setSuccess(true)
                setStep("confirmation")
            }else {
                setError(response.message)
            }


        } catch (err: any) {
            setError(err.message || "Failed to send password reset link. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-slate-800">Reset Password</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="shadow-md border-slate-200">
                            <CardHeader className="pb-4">
                                <div className="flex justify-center mb-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <Lock className="h-6 w-6 text-indigo-600" />
                                    </div>
                                </div>
                                {step === "request" ? (
                                    <>
                                        <h2 className="text-xl font-bold text-center text-slate-900">Forgot your password?</h2>
                                        <p className="text-sm text-center text-slate-500 mt-1">
                                            Enter your email address and we&#39;ll send you a link to reset your password
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-center text-slate-900">Check your email</h2>
                                        <p className="text-sm text-center text-slate-500 mt-1">
                                            We&#39;ve sent a password reset link to {email}
                                        </p>
                                    </>
                                )}
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm flex items-start gap-2">
                                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Error</p>
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                )}

                                {step === "confirmation" && success && (
                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Reset link sent</p>
                                            <p>Please check your email for the password reset link</p>
                                        </div>
                                    </div>
                                )}

                                {step === "request" ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
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

                                        <Button
                                            type="submit"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                'Send Reset Link'
                                            )}
                                        </Button>

                                        <div className="text-center text-sm mt-6">
                                            <p className="text-slate-600">
                                                Remembered your password?{" "}
                                                <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                                    Sign in
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-slate-600">
                                            If you don&#39;t see the email in your inbox, please check your spam folder. The link will expire after 24 hours.
                                        </p>

                                        <Button
                                            type="button"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                                            onClick={() => router.push('/sign-in')}
                                        >
                                            Return to Sign In
                                        </Button>

                                        <div className="text-center text-sm mt-6">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStep("request")
                                                    setSuccess(false)
                                                }}
                                                className="text-indigo-600 hover:text-indigo-800 font-medium"
                                            >
                                                Try another email address
                                            </button>
                                        </div>
                                    </div>
                                )}
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
                            <h3 className="text-2xl font-bold mb-4">Account Security</h3>
                            <p className="text-indigo-100 text-center">
                                We take your account security seriously. Follow the steps to securely reset your password.
                            </p>
                            <div className="mt-8 grid gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                                    <span className="text-sm text-indigo-100">Secure reset process</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                                    <span className="text-sm text-indigo-100">Email verification</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                                    <span className="text-sm text-indigo-100">Single-use reset links</span>
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