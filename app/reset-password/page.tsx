"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
    KeyRound,
    Lock,
    ShieldCheck,
    Loader2,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    ArrowRight,
    Shield,
    X,
    Check,
    ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword, validatePasswordResetToken } from "@/lib/auth-client"
import toast from "react-hot-toast"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [token, setToken] = useState<string | null>(null)
    const [tokenValid, setTokenValid] = useState<boolean>(false)
    const [tokenValidated, setTokenValidated] = useState<boolean>(false)
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(false)
    const [validatingToken, setValidatingToken] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        async function checkToken() {
            try {
                const tokenParam = searchParams?.get("token")
                if (!tokenParam) {
                    setError("Invalid or missing reset token. Please request a new password reset link.")
                    setValidatingToken(false)
                    return
                }

                setToken(tokenParam)

                const validationResult = await validatePasswordResetToken(tokenParam)

                if (validationResult.success && validationResult.message === "Password reset token is valid") {
                    setTokenValid(true)
                } else {
                    setError("Your password reset link is invalid or has expired. Please request a new one.")
                }

                setTokenValidated(true)
                setValidatingToken(false)
            } catch (err) {
                setError("Failed to validate token. Please try again.")
                setValidatingToken(false)
            }
        }

        checkToken()
    }, [searchParams])

    // Password strength calculation
    const calculatePasswordStrength = (password: string) => {
        let score = 0
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        }

        Object.values(checks).forEach((check) => {
            if (check) score += 20
        })

        return { score, checks }
    }

    const passwordStrength = calculatePasswordStrength(password)

    const getPasswordStrengthColor = (score: number) => {
        if (score < 40) return "bg-red-500"
        if (score < 60) return "bg-yellow-500"
        if (score < 80) return "bg-blue-500"
        return "bg-green-500"
    }

    const getPasswordStrengthText = (score: number) => {
        if (score < 40) return "Weak"
        if (score < 60) return "Fair"
        if (score < 80) return "Good"
        return "Strong"
    }

    const validateForm = () => {
        const errors: { [key: string]: string } = {}
        let isValid = true

        if (!password) {
            errors.password = "Password is required"
            isValid = false
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters"
            isValid = false
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords don't match"
            isValid = false
        }

        setFormErrors(errors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!token) {
            setError("Missing reset token. Please request a new password reset link.")
            return
        }

        if (!validateForm()) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await resetPassword(token, password)

            if (response.success) {
                setSuccess(true)
                toast.success("Password reset successful!")

                setTimeout(() => {
                    router.push("/sign-in")
                }, 3000)
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.message || "Failed to reset password. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Show loading state while validating token
    if (validatingToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <Shield className="h-6 w-6 text-blue-600 absolute top-5 left-1/2 transform -translate-x-1/2" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Validating your reset link...</h3>
                    <p className="text-sm text-slate-600 mt-1">Please wait while we verify your security token</p>
                </motion.div>
            </div>
        )
    }

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

            <div className="max-w-md mx-auto py-12 px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Your Password</h1>
                        <p className="text-slate-600">Create a new secure password for your account</p>
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
                                        <p className="font-semibold">Reset Failed</p>
                                        <p className="text-sm">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-3"
                                >
                                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold">Password Updated Successfully!</p>
                                        <p className="text-sm">You will be redirected to the sign-in page shortly...</p>
                                    </div>
                                </motion.div>
                            )}

                            {!token || !tokenValid ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="h-8 w-8 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Invalid Reset Link</h3>
                                    <p className="text-slate-600 mb-6">
                                        {!token ? "Missing reset token in the URL." : "Your password reset link is invalid or has expired."}
                                    </p>
                                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                        <Link href="/forgot-password">
                                            Request New Reset Link
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                            New Password
                                        </Label>
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
                                                disabled={loading || success}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>

                                        {password && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-600">Password strength</span>
                                                    <span
                                                        className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength.score).replace("bg-", "text-")}`}
                                                    >
                            {getPasswordStrengthText(passwordStrength.score)}
                          </span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                                                        style={{ width: `${passwordStrength.score}%` }}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div
                                                        className={`flex items-center gap-1 ${passwordStrength.checks.length ? "text-green-600" : "text-slate-400"}`}
                                                    >
                                                        {passwordStrength.checks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                                        8+ characters
                                                    </div>
                                                    <div
                                                        className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? "text-green-600" : "text-slate-400"}`}
                                                    >
                                                        {passwordStrength.checks.uppercase ? (
                                                            <Check className="h-3 w-3" />
                                                        ) : (
                                                            <X className="h-3 w-3" />
                                                        )}
                                                        Uppercase
                                                    </div>
                                                    <div
                                                        className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? "text-green-600" : "text-slate-400"}`}
                                                    >
                                                        {passwordStrength.checks.lowercase ? (
                                                            <Check className="h-3 w-3" />
                                                        ) : (
                                                            <X className="h-3 w-3" />
                                                        )}
                                                        Lowercase
                                                    </div>
                                                    <div
                                                        className={`flex items-center gap-1 ${passwordStrength.checks.number ? "text-green-600" : "text-slate-400"}`}
                                                    >
                                                        {passwordStrength.checks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                                        Number
                                                    </div>
                                                </div>
                                            </div>
                                        )}

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

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                                            Confirm New Password
                                        </Label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••••"
                                                className={`pl-10 pr-10 h-12 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                                                    formErrors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                                                }`}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={loading || success}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>

                                        {confirmPassword && password !== confirmPassword && (
                                            <p className="text-red-500 text-sm flex items-center gap-1">
                                                <X className="h-3 w-3" />
                                                Passwords don&#39;t match
                                            </p>
                                        )}
                                        {confirmPassword && password === confirmPassword && password.length > 0 && (
                                            <p className="text-green-500 text-sm flex items-center gap-1">
                                                <Check className="h-3 w-3" />
                                                Passwords match
                                            </p>
                                        )}

                                        {formErrors.confirmPassword && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-red-500 text-sm flex items-center gap-1"
                                            >
                                                <AlertCircle className="h-3 w-3" />
                                                {formErrors.confirmPassword}
                                            </motion.p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                                        disabled={loading || success}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating Password...
                                            </>
                                        ) : success ? (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Password Updated
                                            </>
                                        ) : (
                                            <>
                                                Reset Password
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-sm text-slate-600">
                                            Remember your password?{" "}
                                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 font-semibold">
                                                Sign in here
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {/* Security Information */}
                    <div className="mt-8">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Your Security Matters</h3>
                                    <p className="text-blue-100 text-sm">We protect your data with enterprise-grade security</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-blue-200" />
                                    <span className="text-blue-100">256-bit encryption</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-blue-200" />
                                    <span className="text-blue-100">Secure token validation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-blue-200" />
                                    <span className="text-blue-100">Time-limited links</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-blue-200" />
                                    <span className="text-blue-100">Audit trail logging</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-6 text-center">
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
