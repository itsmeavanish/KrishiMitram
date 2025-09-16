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
import { Search, Video, FileText, Download, Play, Clock, User, Star, Leaf, Calendar } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface Tutorial {
  id: string
  title: string
  description: string
  category: "farming" | "app"
  type: "video" | "pdf" | "article"
  duration?: string
  difficulty: "beginner" | "intermediate" | "advanced"
  crop?: string
  season?: string
  thumbnail: string
  url: string
  views: number
  rating: number
  instructor: string
}

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedCrop, setSelectedCrop] = useState("all")

  const headerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const tutorialsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mockTutorials: Tutorial[] = [
      {
        id: "1",
        title: "Complete Guide to Organic Farming",
        description:
          "Learn everything about organic farming from soil preparation to harvest. This comprehensive guide covers sustainable practices and certification processes.",
        category: "farming",
        type: "video",
        duration: "45 min",
        difficulty: "beginner",
        crop: "All Crops",
        season: "All Seasons",
        thumbnail: "/organic-farming-tutorial.jpg",
        url: "#",
        views: 15420,
        rating: 4.8,
        instructor: "Dr. Rajesh Kumar",
      },
      {
        id: "2",
        title: "Advanced Crop Rotation Strategies",
        description:
          "Master advanced crop rotation techniques to maximize yield and maintain soil health. Includes seasonal planning and nutrient management.",
        category: "farming",
        type: "video",
        duration: "32 min",
        difficulty: "advanced",
        crop: "All Crops",
        season: "All Seasons",
        thumbnail: "/crop-rotation-guide.jpg",
        url: "#",
        views: 8750,
        rating: 4.9,
        instructor: "Prof. Meera Sharma",
      },
      {
        id: "3",
        title: "KrishiMitram App Complete Tutorial",
        description:
          "Step-by-step guide to using all features of KrishiMitram platform including marketplace, AI advisory, and community features.",
        category: "app",
        type: "video",
        duration: "18 min",
        difficulty: "beginner",
        thumbnail: "/app-tutorial-guide.jpg",
        url: "#",
        views: 22100,
        rating: 4.7,
        instructor: "Tech Support Team",
      },
      {
        id: "4",
        title: "Integrated Pest Management Manual",
        description:
          "Comprehensive PDF guide covering identification, prevention, and treatment of common agricultural pests using sustainable methods.",
        category: "farming",
        type: "pdf",
        difficulty: "intermediate",
        crop: "Vegetables",
        season: "Summer",
        thumbnail: "/pest-management-pdf.jpg",
        url: "#",
        views: 12300,
        rating: 4.6,
        instructor: "Dr. Priya Patel",
      },
      {
        id: "5",
        title: "Rice Cultivation: Seed to Harvest",
        description:
          "Complete rice farming tutorial covering variety selection, transplanting, water management, and harvesting techniques.",
        category: "farming",
        type: "video",
        duration: "38 min",
        difficulty: "intermediate",
        crop: "Rice",
        season: "Monsoon",
        thumbnail: "/rice-cultivation-guide.jpg",
        url: "#",
        views: 18900,
        rating: 4.8,
        instructor: "Farmer Suresh Singh",
      },
      {
        id: "6",
        title: "Soil Health Assessment Guide",
        description:
          "Learn how to test and improve soil health using simple tools and techniques. Includes pH testing and nutrient analysis.",
        category: "farming",
        type: "article",
        difficulty: "beginner",
        crop: "All Crops",
        season: "All Seasons",
        thumbnail: "/soil-health-testing.jpg",
        url: "#",
        views: 9800,
        rating: 4.5,
        instructor: "Soil Expert Team",
      },
    ]

    setTutorials(mockTutorials)
    setFilteredTutorials(mockTutorials)
  }, [])

  // Filter tutorials
  useEffect(() => {
    const filtered = tutorials.filter((tutorial) => {
      const matchesSearch =
        tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || tutorial.category === selectedCategory
      const matchesType = selectedType === "all" || tutorial.type === selectedType
      const matchesDifficulty = selectedDifficulty === "all" || tutorial.difficulty === selectedDifficulty
      const matchesCrop = selectedCrop === "all" || tutorial.crop === selectedCrop || tutorial.crop === "All Crops"

      return matchesSearch && matchesCategory && matchesType && matchesDifficulty && matchesCrop
    })
    setFilteredTutorials(filtered)
  }, [searchTerm, selectedCategory, selectedType, selectedDifficulty, selectedCrop, tutorials])

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
        tutorialsRef.current?.children,
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
  }, [filteredTutorials])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "pdf":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
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
              Learning Hub
            </h1>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Master modern farming techniques with our comprehensive collection of tutorials, guides, and educational
              resources.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <motion.div ref={filtersRef} className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="farming">Farming</SelectItem>
                  <SelectItem value="app">App Guide</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="pdf">PDFs</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              {/* Crop Filter */}
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  <SelectItem value="Rice">Rice</SelectItem>
                  <SelectItem value="Wheat">Wheat</SelectItem>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">{filteredTutorials.length} tutorials found</div>
          </motion.div>
        </div>
      </section>

      {/* Tutorials Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div ref={tutorialsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <motion.div
                key={tutorial.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={tutorial.thumbnail || "/placeholder.svg"}
                      alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    {tutorial.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play className="h-6 w-6 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className={tutorial.type === "video" ? "bg-red-500" : "bg-blue-500"}>
                        {getTypeIcon(tutorial.type)}
                        <span className="ml-1 capitalize">{tutorial.type}</span>
                      </Badge>
                    </div>
                    {tutorial.duration && (
                      <div className="absolute bottom-3 right-3">
                        <Badge variant="secondary" className="bg-black/70 text-white">
                          <Clock className="h-3 w-3 mr-1" />
                          {tutorial.duration}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {tutorial.category}
                      </Badge>
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>{tutorial.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {tutorial.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed line-clamp-3">
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {tutorial.instructor}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        {tutorial.rating}
                      </div>
                    </div>

                    {tutorial.crop && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Leaf className="h-4 w-4 mr-1" />
                          {tutorial.crop}
                        </div>
                        {tutorial.season && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {tutorial.season}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                      <span>{tutorial.views.toLocaleString()} views</span>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      {tutorial.type === "video" ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Watch Tutorial
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Guide
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredTutorials.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">No tutorials found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default TutorialsPage
