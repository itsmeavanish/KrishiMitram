"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Leaf, Sun, Moon, User, BarChart3 } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/app/context/AuthContext"
import LogoutButton from "./logoutbutton"

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      description: "View your farming activities and analytics",
      icon: BarChart3,
    },
    {
      title: "Government Schemes",
      href: "/schemes",
      description: "Discover and apply for agricultural schemes",
    },
    {
      title: "Marketplace",
      href: "/marketplace",
      description: "Buy, sell, and rent farming equipment",
    },
    {
      title: "AI Advisory",
      href: "/advisory",
      description: "Get personalized farming advice",
    },
    {
      title: "Tutorials",
      href: "/tutorials",
      description: "Learn new farming techniques",
    },
    {
      title: "Community",
      href: "/community",
      description: "Connect with fellow farmers",
    },
  ]

  const { user, loading } = useAuth();
  console.log("user from nav", user);
  
  

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
              <Leaf className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              KrishiMitram
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/80 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-secondary hover:text-secondary-foreground transition-colors"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Link href="/profile">
              <Button
                variant="ghost"
                size="icon"
                className={`hover:bg-secondary hover:text-secondary-foreground transition-colors ${
                  pathname === "/profile" ? "bg-secondary text-secondary-foreground" : ""
                }`}
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {
              !user&& <Link href="/auth/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6">Login</Button>
            </Link>
            }
            {
              user&& <LogoutButton/>
            }
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-secondary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-card">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block p-4 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${
                        pathname === item.href ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon && <item.icon className="h-5 w-5" />}
                        <div>
                          <div className="font-medium text-base">{item.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                        </div>
                      </div>
                    </Link>
                  ))}

                  <div className="border-t border-border pt-4 mt-6">
                    <Link href="/profile" className="block mb-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-border hover:bg-secondary bg-transparent"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Login</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Navigation
