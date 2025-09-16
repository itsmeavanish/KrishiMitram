"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Leaf, Phone, Mail, User, MapPin } from "lucide-react"
import Link from "next/link"
import axios from "axios"
export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/dashboard"
    }, 2000)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response=await axios.post("http://localhost:4000/api/auth/register", {
        name: "Avanish Upadhyay",
        email:"avanishupdhyay63@gmail.com",
        password: "avaish@123",
      })
      window.location.href = "/dashboard"
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4"
          >
            <Leaf className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">KrishiMitram</h1>
          <p className="text-slate-600">Your Digital Farming Companion</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-slate-800">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600">Sign in to access your farming dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Phone</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="text"
                        placeholder="Enter your email or phone"
                        className="pl-10 h-12 border-slate-200 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pr-10 h-12 border-slate-200 focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-slate-300" />
                      <span className="text-slate-600">Remember me</span>
                    </label>
                    <Link href="#" className="text-emerald-600 hover:text-emerald-700">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="firstName"
                          placeholder="First name"
                          className="pl-10 h-12 border-slate-200 focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        className="h-12 border-slate-200 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-10 h-12 border-slate-200 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="location"
                        placeholder="City, State"
                        className="pl-10 h-12 border-slate-200 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="regPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pr-10 h-12 border-slate-200 focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-sm">
                    <input type="checkbox" className="mt-1 rounded border-slate-300" required />
                    <span className="text-slate-600">
                      I agree to the{" "}
                      <Link href="#" className="text-emerald-600 hover:text-emerald-700">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-emerald-600 hover:text-emerald-700">
                        Privacy Policy
                      </Link>
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-slate-600 text-sm">
            Need help?{" "}
            <Link href="#" className="text-emerald-600 hover:text-emerald-700">
              Contact Support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
