"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Shield,
  Lock,
  CheckCircle,
  Users,
  Zap,
  Globe,
  Star,
  Github,
  Chrome,
  Smartphone,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [showDemo, setShowDemo] = useState(false)
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, loading, router])

  if (loading || isAuthenticated) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <Shield className="h-6 w-6 text-blue-600 absolute top-5 left-1/2 transform -translate-x-1/2" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Redirecting to dashboard...</h3>
          </motion.div>
        </div>
    )
  }

  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and OAuth 2.0 compliance for maximum protection",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized authentication flow with minimal latency and instant responses",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Worldwide CDN and infrastructure supporting millions of users",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Users,
      title: "Multi-Provider",
      description: "Support for Google, GitHub, and custom authentication providers",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "10M+", label: "Users Protected" },
    { number: "256-bit", label: "Encryption" },
    { number: "<100ms", label: "Response Time" },
  ]

  const testimonials = [
    {
      name: "Mr Somnang",
      role: "CTO at KeoPrel",
      content: "SecureAuth transformed our authentication system. The security features are enterprise-grade.",
      avatar: "SC",
    },
    {
      name: "Mr Sohpann",
      role: "Lead Developer",
      content: "Implementation was seamless. Our users love the smooth OAuth experience.",
      avatar: "MJ",
    },
    {
      name: "Mr Vakhim",
      role: "Smos Engineer",
      content: "The best authentication solution we've used. Comprehensive and reliable.",
      avatar: "ER",
    },
  ]

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SecureAuth
              </span>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" asChild >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
                  <Lock className="h-3 w-3 mr-1" />
                  Enterprise-Grade Security
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
                  Secure Authentication
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
                </h1>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Implement OAuth 2.0 authentication with enterprise-grade security. Protect your users with bank-level
                  encryption and seamless social login integration.
                </p>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6"
                >
                  <Link href="/sign-up">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 border-2 hover:bg-blue-50"
                    onClick={() => setShowDemo(!showDemo)}
                >
                  {showDemo ? <EyeOff className="mr-2 h-5 w-5" /> : <Eye className="mr-2 h-5 w-5" />}
                  {showDemo ? "Hide Demo" : "View Demo"}
                </Button>
              </motion.div>

              {/* Demo Section */}
              {showDemo && (
                  <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-12"
                  >
                    <Card className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm border-0 shadow-2xl">
                      <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                          <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-slate-900">Live Authentication Demo</h3>
                            <p className="text-slate-600">Experience our OAuth 2.0 implementation in action</p>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span>Google OAuth Integration</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span>GitHub Authentication</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span>JWT Token Management</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-900 rounded-xl p-6 text-green-400 font-mono text-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="ml-2 text-slate-400">terminal</span>
                            </div>
                            <div className="space-y-2">
                              <div>$ npm install @secureauth/oauth</div>
                              <div className="text-slate-400"># Installing dependencies...</div>
                              <div className="text-green-400">✓ OAuth 2.0 configured</div>
                              <div className="text-green-400">✓ JWT tokens enabled</div>
                              <div className="text-green-400">✓ Security headers set</div>
                              <div className="text-blue-400">🚀 Ready to authenticate!</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
              )}
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
                    <div className="text-slate-600">{stat.label}</div>
                  </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose SecureAuth?</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Built for developers, trusted by enterprises. Our authentication platform provides everything you need to
                secure your applications.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                  <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                  >
                    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className={`p-3 rounded-xl ${feature.color} w-fit mb-4`}>
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                        <p className="text-slate-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 px-4 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Seamless Integration</h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Connect with popular platforms and frameworks in minutes, not hours.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-slate-700 rounded-xl w-fit mx-auto mb-4">
                    <Chrome className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Web Applications</h3>
                  <p className="text-slate-400">React, Vue, Angular, and vanilla JavaScript support</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-slate-700 rounded-xl w-fit mx-auto mb-4">
                    <Smartphone className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Mobile Apps</h3>
                  <p className="text-slate-400">iOS, Android, and React Native SDKs available</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-slate-700 rounded-xl w-fit mx-auto mb-4">
                    <Github className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Backend APIs</h3>
                  <p className="text-slate-400">Node.js, Python, Java, and .NET integrations</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Trusted by Developers Worldwide</h2>
              <p className="text-xl text-slate-600">See what our community has to say about SecureAuth</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                  <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                  >
                    <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-slate-700 mb-6 italic">{testimonial.content}</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{testimonial.name}</div>
                            <div className="text-sm text-slate-600">{testimonial.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Ready to Secure Your Application?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of developers who trust SecureAuth for their authentication needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                  <Link href="/sign-up">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-xl">SecureAuth</span>
                    <p className="text-sm text-slate-400">Enterprise-grade security</p>
                  </div>
                </div>
                <p className="text-slate-400 max-w-md">
                  The most trusted authentication platform for modern applications. Secure, scalable, and
                  developer-friendly.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      API Reference
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; {new Date().getFullYear()} SecureAuth. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  )
}
