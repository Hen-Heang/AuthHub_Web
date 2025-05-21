"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { KeyRound, Lock, ShieldCheck, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword, validatePasswordResetToken } from "@/lib/auth-client"
import toast from "react-hot-toast"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [token, setToken] = useState<string | null>(null)
    const [tokenValid, setTokenValid] = useState<boolean>(false)
    const [tokenValidated, setTokenValidated] = useState<boolean>(false)
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
    const [loading, setLoading] = useState(false)
    const [validatingToken, setValidatingToken] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        async function checkToken() {
            try {
                // Extract token from URL query parameters
                const tokenParam = searchParams?.get('token')
                if (!tokenParam) {
                    setError("Invalid or missing reset token. Please request a new password reset link.")
                    setValidatingToken(false)
                    return
                }

                setToken(tokenParam)

                // Validate the token with the backend
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

    // Validate form fields
    const validateForm = () => {
        const errors: {[key: string]: string} = {}
        let isValid = true

        // Validate password
        if (!password) {
            errors.password = "Password is required"
            isValid = false
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters"
            isValid = false
        }

        // Check if passwords match
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

        // Validate form
        if (!validateForm()) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Call the API to reset the password
            const response = await resetPassword(token, password)

            if (response.success) {
                setSuccess(true)
                toast.success("Password reset successful!")

                // Redirect to sign-in after success (with a short delay to show the success message)
                setTimeout(() => {
                    router.push('/sign-in')
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

    // Password strength indicator
    const getPasswordStrength = () => {
        if (!password) return { strength: 0, label: '', color: '' }

        let strength = 0

        // Length check
        if (password.length >= 8) strength += 1

        // Complexity checks
        if (/[A-Z]/.test(password)) strength += 1 // Has uppercase
        if (/[a-z]/.test(password)) strength += 1 // Has lowercase
        if (/[0-9]/.test(password)) strength += 1 // Has number
        if (/[^A-Za-z0-9]/.test(password)) strength += 1 // Has special char

        let label = ''
        let color = ''

        switch(strength) {
            case 0:
            case 1:
                label = 'Weak'
                color = 'bg-red-500'
                break
            case 2:
            case 3:
                label = 'Medium'
                color = 'bg-amber-500'
                break
            case 4:
            case 5:
                label = 'Strong'
                color = 'bg-green-500'
                break
        }

        return {
            strength: (strength / 5) * 100,
            label,
            color
        }
    }

    const passwordStrength = getPasswordStrength()

    // Show loading state while validating token
    if (validatingToken) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800">Validating your reset link...</h3>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-md mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}>
                    <Card className="shadow-md border-slate-200">
                        <CardHeader className="pb-4">
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <Lock className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-center text-slate-900">Reset Your Password</h2>
                            <p className="text-sm text-center text-slate-500 mt-1">
                                Create a new secure password for your account
                            </p>
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

                            {success && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm flex items-start gap-2">
                                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Password updated successfully!</p>
                                        <p>You will be redirected to the sign-in page shortly...</p>
                                    </div>
                                </div>
                            )}

                            {!token || !tokenValid ? (
                                <div className="text-center py-4">
                                    <p className="text-slate-600 mb-4">
                                        {!token ? "Missing reset token." : "Your password reset link is invalid or has expired."}
                                    </p>
                                    <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                        Request a new password reset link
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className={`pl-10 ${formErrors.password ? 'border-red-300 focus-visible:ring-red-500' : ''}`}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={loading || success}
                                            />
                                        </div>
                                        {formErrors.password && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                                        )}

                                        {password && (
                                            <div className="mt-2">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-slate-500">Password strength:</span>
                                                    <span className="text-xs font-medium" style={{ color: passwordStrength.color === 'bg-green-500' ? 'rgb(34 197 94)' : passwordStrength.color === 'bg-amber-500' ? 'rgb(245 158 11)' : 'rgb(239 68 68)' }}>
                                                        {passwordStrength.label}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${passwordStrength.color}`}
                                                        style={{ width: `${passwordStrength.strength}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Use 8+ characters with a mix of letters, numbers & symbols
                                                </p>
                                            </div>
                                        )}
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
                                                disabled={loading || success}
                                            />
                                        </div>
                                        {formErrors.confirmPassword && (
                                            <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700"
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
                                            'Reset Password'
                                        )}
                                    </Button>

                                    <div className="text-center text-sm mt-6">
                                        <p className="text-slate-600">
                                            Remember your password?{" "}
                                            <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-center border-t border-slate-100 pt-6">
                            <div className="flex items-center text-xs text-slate-500">
                                <ShieldCheck className="mr-1 h-3 w-3 text-indigo-500" />
                                Your password is securely encrypted
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}