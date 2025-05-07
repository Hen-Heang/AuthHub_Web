"use client"

import { useState } from "react"
import { LogOut, CheckCircle, Info, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function DashboardPage() {
    const [user] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        provider: "Google",
        verified: true,
    })

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-indigo-600 text-white">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6" />
                        <h1 className="font-bold text-xl">OAuth Demo App</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm hidden md:inline-block">John Doe</span>
                        <Button className="text-white hover:bg-indigo-700">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-slate-900">Welcome to your Dashboard, John!</h2>
                    <p className="text-slate-600 mt-2">Here&#39;s an overview of your account information and OAuth details.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="shadow-md border-slate-200">
                            <CardHeader className="pb-2">
                                <h3 className="text-xl font-bold text-slate-900">Account Information</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 items-center border-b border-slate-100 pb-4">
                                        <div className="text-sm font-medium text-slate-500">Name:</div>
                                        <div className="col-span-2 font-medium">{user.name}</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 items-center border-b border-slate-100 pb-4">
                                        <div className="text-sm font-medium text-slate-500">Email:</div>
                                        <div className="col-span-2">{user.email}</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 items-center border-b border-slate-100 pb-4">
                                        <div className="text-sm font-medium text-slate-500">Provider:</div>
                                        <div className="col-span-2 flex items-center gap-2">
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
                                            {user.provider}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <div className="text-sm font-medium text-slate-500">Verified:</div>
                                        <div className="col-span-2 flex items-center gap-2">
                                            {user.verified ? (
                                                <>
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    <span>Yes</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Info className="h-5 w-5 text-amber-500" />
                                                    <span>No</span>
                                                    <Button  className="ml-2 text-xs">
                                                        Verify
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="shadow-md border-slate-200">
                            <CardHeader className="pb-2">
                                <h3 className="text-xl font-bold text-slate-900">About OAuth Authentication</h3>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 text-slate-700">
                                    <p>
                                        This application demonstrates how to implement OAuth 2.0 authentication using a Spring Boot backend
                                        and Next.js frontend. You&#39;re authenticated using Google.
                                    </p>

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-indigo-600" />
                                            OAuth 2.0 Benefits
                                        </h4>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start gap-2">
                                                <Badge variant="outline" className="mt-0.5">
                                                    Secure
                                                </Badge>
                                                <span>Industry-standard protocol for authorization</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Badge variant="outline" className="mt-0.5">
                                                    Simple
                                                </Badge>
                                                <span>Easy sign-in with existing accounts</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Badge variant="outline" className="mt-0.5">
                                                    Flexible
                                                </Badge>
                                                <span>Support for multiple identity providers</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button  className="text-xs">
                                            Learn more about OAuth
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}

