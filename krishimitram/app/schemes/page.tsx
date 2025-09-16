"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, MapPin, TrendingUp, ExternalLink, Clock } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface Scheme {
  id: string
  title: string
  description: string
  benefits: string
  eligibility: string[]
  deadline: string
  category: string
  state: string
  amount: string
  status: "active" | "urgent" | "new"
  applicationLink: string
}

const SchemesPage = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedState, setSelectedState] = useState("all")

  const headerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const schemesRef = useRef<HTMLDivElement>(null)

  // Mock data for government schemes
  useEffect(() => {
    const mockSchemes: Scheme[] = [
      {
        id: "1",
        title: "PM-KISAN Samman Nidhi",
        description: "Direct income support to farmers with cultivable land holding",
        benefits: "₹6,000 per year in three equal installments",
        eligibility: ["Small and marginal farmers", "Cultivable land holding", "Valid Aadhaar card"],
        deadline: "2024-12-31",
        category: "Income Support",
        state: "All India",
        amount: "₹6,000/year",
        status: "active",
        applicationLink: "https://pmkisan.gov.in",
      },
      {
        id: "2",
        title: "Pradhan Mantri Fasal Bima Yojana",
        description: "Crop insurance scheme providing financial support to farmers",
        benefits: "Comprehensive risk cover for crops",
        eligibility: ["All farmers", "Sharecroppers and tenant farmers", "Notified crops"],
        deadline: "2024-11-15",
        category: "Insurance",
        state: "All India",
        amount: "Up to ₹2 lakh",
        status: "urgent",
        applicationLink: "https://pmfby.gov.in",
      },
      {
        id: "3",
        title: "Kisan Credit Card Scheme",
        description: "Credit facility for farmers to meet their agricultural needs",
        benefits: "Easy access to credit at subsidized interest rates",
        eligibility: ["All farmers", "Valid land documents", "Good credit history"],
        deadline: "2025-03-31",
        category: "Credit",
        state: "All India",
        amount: "Up to ₹3 lakh",
        status: "active",
        applicationLink: "https://kcc.gov.in",
      },
      {
        id: "4",
        title: "Soil Health Card Scheme",
        description: "Provides soil health cards to farmers for better crop planning",
        benefits: "Free soil testing and nutrient recommendations",
        eligibility: ["All farmers", "Land ownership documents"],
        deadline: "2024-10-30",
        category: "Soil Health",
        state: "All India",
        amount: "Free",
        status: "new",
        applicationLink: "https://soilhealth.dac.gov.in",
      },
      {
        id: "5",
        title: "National Agriculture Market (e-NAM)",
        description: "Online trading platform for agricultural commodities",
        benefits: "Better price discovery and transparent trading",
        eligibility: ["Registered farmers", "Valid FPO membership"],
        deadline: "2025-06-30",
        category: "Marketing",
        state: "All India",
        amount: "No fee",
        status: "active",
        applicationLink: "https://enam.gov.in",
      },
      {
        id: "6",
        title: "Paramparagat Krishi Vikas Yojana",
        description: "Promotes organic farming practices among farmers",
        benefits: "₹50,000 per hectare for 3 years",
        eligibility: ["Farmers willing to adopt organic farming", "Minimum 50 farmers per cluster"],
        deadline: "2024-12-15",
        category: "Organic Farming",
        state: "All India",
        amount: "₹50,000/ha",
        status: "active",
        applicationLink: "https://pgsindia-ncof.gov.in",
      },
    ]
    setSchemes(mockSchemes)
    setFilteredSchemes(mockSchemes)
  }, [])

  // Filter schemes based on search and filters
  useEffect(() => {
    const filtered = schemes.filter((scheme) => {
      const matchesSearch =
        scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || scheme.category === selectedCategory
      const matchesState = selectedState === "all" || scheme.state === selectedState

      return matchesSearch && matchesCategory && matchesState
    })
    setFilteredSchemes(filtered)
  }, [searchTerm, selectedCategory, selectedState, schemes])

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 },
      )

      gsap.fromTo(
        filtersRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.4 },
      )

      gsap.fromTo(
        schemesRef.current?.children,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.6,
          stagger: 0.1,
        },
      )
    })

    return () => ctx.revert()
  }, [filteredSchemes])

  const categories = ["all", "Income Support", "Insurance", "Credit", "Soil Health", "Marketing", "Organic Farming"]
  const states = ["all", "All India", "Maharashtra", "Punjab", "Uttar Pradesh", "Karnataka", "Tamil Nadu"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "urgent":
        return <Clock className="h-3 w-3" />
      case "new":
        return <TrendingUp className="h-3 w-3" />
      default:
        return <Calendar className="h-3 w-3" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-secondary/10">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div ref={headerRef} className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
              Government Schemes Hub
            </h1>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Discover and apply for agricultural schemes designed to support farmers across India. Find the right
              scheme for your needs and boost your farming success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <motion.div ref={filtersRef} className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schemes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* State Filter */}
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full lg:w-48">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state === "all" ? "All States" : state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">{filteredSchemes.length} schemes found</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Schemes Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div ref={schemesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
              <motion.div
                key={scheme.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getStatusColor(scheme.status)} flex items-center gap-1`}>
                        {getStatusIcon(scheme.status)}
                        {scheme.status.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div className="font-semibold text-primary">{scheme.amount}</div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {scheme.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed line-clamp-3">
                      {scheme.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Benefits:</h4>
                      <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">Eligibility:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {scheme.eligibility.slice(0, 2).map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                        {scheme.eligibility.length > 2 && (
                          <li className="text-primary text-xs">+{scheme.eligibility.length - 2} more criteria</li>
                        )}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Deadline: {new Date(scheme.deadline).toLocaleDateString()}
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 group/btn"
                        onClick={() => window.open(scheme.applicationLink, "_blank")}
                      >
                        Apply Now
                        <ExternalLink className="ml-1 h-3 w-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredSchemes.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">No schemes found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default SchemesPage
