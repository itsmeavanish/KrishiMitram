"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const router = useRouter()
  const { user } = useAuth() // so you can check if logged in

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // include cookies
      })

      // Optionally clear client-side context
      window.location.href = "/auth/login" 
      // or router.push("/auth/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  if (!user) return null

  return (
    <Button
      onClick={handleLogout}
      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
    >
      Logout
    </Button>
  )
}
