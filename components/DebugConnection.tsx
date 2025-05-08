'use client'

import { useState } from 'react'

import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import {testApiConnection, testAuthentication, testRegistration} from "@/lib/auth-client";
import {Button} from "@/components/ui/button";

interface DebugConnectionProps {
    email?: string
    password?: string
    name?: string
}

export default function DebugConnection({ email = '', password = '', name = '' }: DebugConnectionProps) {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean, message: string, details?: any } | null>(null)
    const [showDebug, setShowDebug] = useState(false)

    const handleTestConnection = async () => {
        setLoading(true)
        try {
            const response = await testApiConnection()
            setResult(response)
        } catch (error: any) {
            setResult({
                success: false,
                message: `Error testing connection: ${error.message}`
            })
        } finally {
            setLoading(false)
        }
    }

    const handleTestAuth = async () => {
        if (!email || !password) {
            setResult({
                success: false,
                message: 'Please enter email and password to test authentication'
            })
            return
        }

        setLoading(true)
        try {
            const response = await testAuthentication(email, password)
            setResult(response)
        } catch (error: any) {
            setResult({
                success: false,
                message: `Error testing authentication: ${error.message}`
            })
        } finally {
            setLoading(false)
        }
    }

    const handleTestRegistration = async () => {
        if (!name || !email || !password) {
            setResult({
                success: false,
                message: 'Please enter name, email, and password to test registration'
            })
            return
        }

        setLoading(true)
        try {
            const response = await testRegistration(name, email, password)
            setResult(response)
        } catch (error: any) {
            setResult({
                success: false,
                message: `Error testing registration: ${error.message}`
            })
        } finally {
            setLoading(false)
        }
    }

    if (!showDebug) {
        return (
            <div className="mt-4 text-center">
                <button
                    onClick={() => setShowDebug(true)}
                    className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                    Having trouble? Show debug tools
                </button>
            </div>
        )
    }

    return (
        <div className="mt-6 p-4 border border-slate-200 rounded-md bg-slate-50">
            <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-700">Connection Debugging Tools</h3>
                <p className="text-xs text-slate-500">Use these tools to diagnose connection issues</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                    Test API Connection
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleTestAuth}
                    disabled={loading || !email || !password}
                >
                    {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                    Test Authentication
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleTestRegistration}
                    disabled={loading || !name || !email || !password}
                >
                    {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                    Test Registration
                </Button>
            </div>

            {result && (
                <div className={`p-3 rounded-md text-sm ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-start gap-2">
                        {result.success ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                            <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                                {result.message}
                            </p>
                            {result.details && (
                                <details className="mt-2">
                                    <summary className="text-xs cursor-pointer">Show details</summary>
                                    <pre className="mt-2 p-2 bg-slate-800 text-white rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4 text-right">
                <button
                    onClick={() => setShowDebug(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                    Hide debug tools
                </button>
            </div>
        </div>
    )
}