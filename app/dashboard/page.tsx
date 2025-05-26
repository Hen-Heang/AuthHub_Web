"use client"

import { useEffect, useState } from "react"
import {
    LogOut,
    CheckCircle,
    Info,
    Shield,
    Loader2,
    RefreshCw,
    Mail,
    Calendar,
    Eye,
    EyeOff,
    Lock,
    Activity,
    Users,
    Settings,
    Bell,
    Search,
    ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import EditUserForm from "@/components/ui/EditUserForm"
import type { User } from "@/lib/hook/useUsers"
import {Avatar,AvatarFallback, AvatarImage} from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import {DropdownMenuContent, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu"



export default function DashboardPage() {
    const { user, logout, isAuthenticated, loading, fetchCurrentUser } = useAuth()
    const [refreshing, setRefreshing] = useState(false)
    const [showSensitiveData, setShowSensitiveData] = useState(false)
    const router = useRouter()
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    type LocalUser = User & { id: number }

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/sign-in")
        }
    }, [loading, isAuthenticated, router])

    const handleRefreshUserData = async () => {
        try {
            setRefreshing(true)
            await fetchCurrentUser()
            setLastRefreshed(new Date())
        } catch (error) {
            console.error("Failed to refresh user data:", error)
        } finally {
            setRefreshing(false)
        }
    }

    const handleEditUser = (user: LocalUser) => {
        setSelectedUser(user)
        setIsEditDialogOpen(true)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <Shield className="h-6 w-6 text-blue-600 absolute top-5 left-1/2 transform -translate-x-1/2" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Securing your dashboard...</h3>
                    <p className="text-sm text-slate-600 mt-1">Please wait while we verify your credentials</p>
                </motion.div>
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return null
    }

    const securityScore = user.emailVerified ? 85 : 65
    const getSecurityColor = (score: number) => {
        if (score >= 80) return "text-emerald-600"
        if (score >= 60) return "text-amber-600"
        return "text-red-600"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Enhanced Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SecureAuth
                </span>
                            </Link>

                            <nav className="hidden lg:flex items-center space-x-1">
                                <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                                    Dashboard
                                </Link>
                                <Link
                                    href="/users"
                                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    Users
                                </Link>
                                <Link
                                    href="/profile"
                                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    Profile
                                </Link>
                            </nav>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="relative">
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <Input placeholder="Search..." className="pl-9 w-64 bg-white/50 border-slate-200 focus:bg-white" />
                                </div>
                                <Button variant="outline" size="icon" className="relative">
                                    <Bell className="h-4 w-4" />
                                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                                </Button>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2 hover:bg-blue-50">
                                        <div className="h-8 w-8">
                                            <Avatar >

                                                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                                    </AvatarFallback>

                                            </Avatar>
                                        </div>
                                        <div className="hidden md:block text-left">
                                            <div className="text-sm font-medium">{user.name || user.email.split("@")[0]}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem>
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Users className="h-4 w-4 mr-2" />
                                        Manage Users
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-red-600">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Welcome back, {user.name || user.email.split("@")[0]}! 👋
                            </h1>
                            <p className="text-slate-600">
                                Your security dashboard is ready. Monitor your account and manage your authentication settings.
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Last updated: {lastRefreshed.toLocaleTimeString()}
                                </div>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Secure Session
                                </Badge>
                            </div>
                        </div>
                        <Button
                            onClick={handleRefreshUserData}
                            variant="outline"
                            disabled={refreshing}
                            className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200"
                        >
                            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            {refreshing ? "Refreshing..." : "Refresh Data"}
                        </Button>
                    </div>
                </motion.div>

                {/* Security Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                >
                    <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Security Score</h3>
                                    <p className="text-blue-100 text-sm">Your account security rating</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">{securityScore}%</div>
                                    <div className="text-sm text-blue-100">
                                        {securityScore >= 80 ? "Excellent" : securityScore >= 60 ? "Good" : "Needs Improvement"}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 bg-white/20 rounded-full h-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${securityScore}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="bg-white rounded-full h-2"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Account Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Shield className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">Account Information</h3>
                                            <p className="text-sm text-slate-600">Manage your personal details</p>
                                        </div>
                                    </div>
                                    {user.id && (
                                        <Badge variant="outline" className="bg-slate-50">
                                            ID: {user.id}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Mail className="h-4 w-4 text-slate-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-500">Email Address</div>
                                                <div className="font-semibold">
                                                    {showSensitiveData ? user.email : user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setShowSensitiveData(!showSensitiveData)}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Users className="h-4 w-4 text-slate-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-500">Display Name</div>
                                                <div className="font-semibold">{user.name || "Not provided"}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                {user.provider === "GOOGLE" ? (
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
                                                ) : user.provider === "GITHUB" ? (
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                                                        <path
                                                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12"
                                                            fill="#24292F"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <Shield className="h-4 w-4 text-slate-600" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-500">Authentication Provider</div>
                                                <div className="font-semibold">{user.provider || "LOCAL"}</div>
                                            </div>
                                        </div>
                                        <Badge variant={user.provider ? "default" : "secondary"} className="bg-blue-100 text-blue-700">
                                            {user.provider ? "OAuth" : "Local"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                {user.emailVerified ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Info className="h-4 w-4 text-amber-600" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-500">Email Verification</div>
                                                <div className="font-semibold">{user.emailVerified ? "Verified" : "Pending Verification"}</div>
                                            </div>
                                        </div>
                                        {!user.emailVerified && (
                                            <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                                                Verify Now
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end pt-4 border-t border-slate-100">
                                <Button onClick={() => handleEditUser(user as LocalUser)} className="bg-blue-600 hover:bg-blue-700">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    {/* Security & Session Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Session Information */}
                        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Activity className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Session Status</h3>
                                        <p className="text-sm text-slate-600">Current session details</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Status</span>
                                        <Badge className="bg-green-100 text-green-700 border-green-200">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                            Active
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Login Time</span>
                                        <span className="text-sm font-medium">{new Date().toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Expires</span>
                                        <span className="text-sm font-medium">15 min</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Token Type</span>
                                        <span className="text-sm font-medium">JWT</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Features */}
                        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Lock className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Security Features</h3>
                                        <p className="text-sm text-slate-600">Active protections</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">OAuth 2.0 Authentication</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">JWT Token Security</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">HTTPS Encryption</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                                        <Info className="h-4 w-4 text-amber-600" />
                                        <span className="text-sm font-medium">2FA Available</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8"
                >
                    <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
                                    <p className="text-sm text-slate-600">Your latest security events</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">Successful login</p>
                                        <p className="text-sm text-slate-600">You logged in to your account</p>
                                        <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Shield className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">Account created</p>
                                        <p className="text-sm text-slate-600">Your secure account was established</p>
                                        <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>

            {/* Enhanced Footer */}
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

            <EditUserForm user={selectedUser} isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />
        </div>
    )
}
