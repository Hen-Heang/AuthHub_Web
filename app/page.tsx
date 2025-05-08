'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import PostList from "@/components/ui/PostList"
import CreatePostForm from "@/components/ui/CreatePostForm"

export default function HomePage() {
  const [showPosts, setShowPosts] = useState(false)
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // If authenticated, redirect to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])

  // Only show the homepage content if not authenticated
  if (loading || isAuthenticated) {
    return null // Don't render anything while loading or if authenticated (redirecting)
  }

  return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-800">Home Page</h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 mb-8">
            <div className="text-center space-y-4 max-w-xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900">Modern Authentication with</h2>
              <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
                OAuth 2.0
              </h1>
              <p className="text-slate-600">
                A complete OAuth 2.0 solution with Spring Boot backend and Next.js frontend.
              </p>
              <p className="text-slate-500 text-sm">Sign in with your email or use social login providers.</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/sign-up">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/sign-in">Log in</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl p-8 text-center text-white shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <Shield className="h-12 w-12 mb-2" />
              <h3 className="text-2xl font-bold">Secure, Modern Authentication For Your Web Applications</h3>
              <p className="max-w-lg mx-auto text-indigo-100">
                Implement OAuth 2.0 with ease and provide your users with a seamless authentication experience.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button
                size="lg"
                className="mb-8"
                onClick={() => setShowPosts(!showPosts)}>
              {showPosts ? "Hide Posts" : "Show Posts"}
            </Button>
            {showPosts && (
                <div className="mt-6">
                  <PostList />
                </div>
            )}
          </div>
          <CreatePostForm />
        </div>
      </div>
  )
}