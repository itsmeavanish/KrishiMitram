"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Leaf, Phone, Mail, User, MapPin } from "lucide-react"
import Dropdown from "@/components/ui/dropdown"
import { useAuth } from "@/app/context/AuthContext";
import { jwtDecode } from "jwt-decode"



// ✅ Define roles as tuple
const roles = ["farmer", "buyer", "storeowner", "officer"] as const
type Role = typeof roles[number]

type Field = {
  name: string
  label: string
  required?: boolean
}
type FormData = {
  [key: string]: string | { lat: number; lng: number }; // allow geolocation object
};


const roleFields: Record<Role, Field[]> = {
  farmer: [
    { name: "address", label: "Address", required: true },
    { name: "name", label: "Full Name", required: true },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone" },
  ],
  buyer: [
    { name: "address", label: "Address", required: true },
    { name: "name", label: "Full Name", required: true },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone" },
    { name: "company", label: "Company", required: true },
    { name: "GSTno", label: "GST No" },
    { name: "PAN", label: "PAN" },
  ],
  storeowner: [
    { name: "address", label: "Address", required: true },
    { name: "ownerName", label: "Owner Name" },
    { name: "storeName", label: "Store Name" },
    { name: "GSTno", label: "GST No" },
    { name: "storetype", label: "Store Type (equipment/pesticide fertilizer)" },
    { name: "storesize", label: "Store Size (small/wholeseller/retailer)" },
    { name: "contact", label: "Contact" },
  ],
  officer: [
    { name: "address", label: "Address", required: true },
    { name: "name", label: "Full Name", required: true },
    { name: "email", label: "Email" },
    { name: "contact", label: "Contact" },
    { name: "employeeId", label: "Employee ID", required: true },
    { name: "department", label: "Department" },
    { name: "post", label: "Post" },
    { name: "division", label: "Division" },
  ],
}

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<Role>("farmer");
  const [formData, setFormData] = useState<FormData>({});
  const { user, loading } = useAuth();


  useEffect(() => {
    if (role !== "officer" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData((prev) => ({
            ...prev,
            geolocation: {
              lat: latitude,
              lng: longitude,
            },
          }));
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, [role]);


  const { setUser } = useAuth(); // make sure setUser is exposed in context

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log({ role, formData });

      const payload = { ...formData };

      // 1️⃣ Call login API
      const loginRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // cookie will be set
      });

      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        console.error("Login failed:", errorData);
        return;
      }
      const meRes = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!meRes.ok) {
        console.error("Failed to fetch user info");
        return;
      }

      const meData = await meRes.json();

      const decoded: any = jwtDecode(meData.token);
      setUser(decoded);

      if (decoded?.user.role === "farmer") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/dashboardofficer";
      }

    } catch (error) {
      console.log("Login error:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log({ role, formData });

      const payload = {
        role,
        ...formData
      };

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      window.location.href = "/"
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
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

              {/* ✅ Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Phone</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="text"
                        name="email"
                        onChange={handleChange}
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
                        name="password"
                        onChange={handleChange}
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

                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* ✅ Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Role Dropdown */}
                  <Dropdown options={roles} value={role} onChange={(val: string) => setRole(val as Role)} />

                  {/* Dynamic Fields */}
                  {roleFields[role].map((field) => (
                    <div className="space-y-2" key={field.name}>
                      <Label htmlFor={field.name}>{field.label}</Label>
                      <div className="relative">
                        {field.name === "name" && <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />}
                        {field.name === "email" && <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />}
                        {field.name === "phone" && <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />}
                        {field.name === "address" && <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />}

                        <Input
                          id={field.name}
                          type={field.name === "email" ? "email" : "text"}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                          name={field.name}
                          onChange={handleChange}
                          className={`h-12 border-slate-200 focus:border-emerald-500 ${["name", "email", "phone", "address"].includes(field.name) ? "pl-10" : ""
                            }`}
                          required={field.required || false}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="regPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        name="password"
                        onChange={handleChange}
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
      </motion.div>
    </div>
  )
}
