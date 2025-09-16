"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  MapPin,
  Star,
  MessageCircle,
  Phone,
  Plus,
  Tractor,
  Wheat,
  ShoppingCart,
  Clock,
  User,
  Heart,
  Share2,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: number
  category: "equipment" | "crops" | "seeds" | "fertilizers"
  type: "sale" | "rent"
  location: string
  seller: {
    name: string
    rating: number
    phone: string
  }
  images: string[]
  condition?: "new" | "good" | "fair"
  availability: "available" | "rented" | "sold"
  postedDate: string
  featured: boolean
}

const MarketplacePage = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)

  const headerRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  // Mock marketplace data
  useEffect(() => {
    const mockItems: MarketplaceItem[] = [
      {
        id: "1",
        title: "John Deere Tractor 5050D",
        description: "Well-maintained tractor with 2000 hours of usage. Perfect for medium-sized farms.",
        price: 850000,
        category: "equipment",
        type: "sale",
        location: "Punjab",
        seller: {
          name: "Rajesh Kumar",
          rating: 4.8,
          phone: "+91 98765 43210",
        },
        images: ["/john-deere-tractor.jpg"],
        condition: "good",
        availability: "available",
        postedDate: "2024-01-10",
        featured: true,
      },
      {
        id: "2",
        title: "Organic Wheat - 100 Quintals",
        description: "Premium quality organic wheat, freshly harvested. Certified organic by NPOP.",
        price: 2500,
        category: "crops",
        type: "sale",
        location: "Haryana",
        seller: {
          name: "Priya Sharma",
          rating: 4.9,
          phone: "+91 87654 32109",
        },
        images: ["/organic-wheat-grains.jpg"],
        availability: "available",
        postedDate: "2024-01-12",
        featured: true,
      },
      {
        id: "3",
        title: "Rotavator for Rent",
        description: "Heavy-duty rotavator available for daily/weekly rental. Includes operator if needed.",
        price: 1500,
        category: "equipment",
        type: "rent",
        location: "Maharashtra",
        seller: {
          name: "Suresh Patil",
          rating: 4.6,
          phone: "+91 76543 21098",
        },
        images: ["/rotavator-farming-equipment.jpg"],
        condition: "good",
        availability: "available",
        postedDate: "2024-01-08",
        featured: false,
      },
      {
        id: "4",
        title: "Hybrid Tomato Seeds - 1kg",
        description: "High-yield hybrid tomato seeds with disease resistance. Suitable for all seasons.",
        price: 2800,
        category: "seeds",
        type: "sale",
        location: "Karnataka",
        seller: {
          name: "Lakshmi Reddy",
          rating: 4.7,
          phone: "+91 65432 10987",
        },
        images: ["/tomato-seeds-packet.jpg"],
        availability: "available",
        postedDate: "2024-01-14",
        featured: false,
      },
      {
        id: "5",
        title: "Organic Fertilizer - 50kg Bags",
        description: "100% organic fertilizer made from cow dung and kitchen waste. Rich in nutrients.",
        price: 450,
        category: "fertilizers",
        type: "sale",
        location: "Tamil Nadu",
        seller: {
          name: "Murugan Pillai",
          rating: 4.5,
          phone: "+91 54321 09876",
        },
        images: ["/organic-fertilizer-bags.jpg"],
        availability: "available",
        postedDate: "2024-01-11",
        featured: false,
      },
      {
        id: "6",
        title: "Fresh Basmati Rice - 200 Quintals",
        description: "Premium basmati rice, aged for 2 years. Export quality with long grains.",
        price: 4500,
        category: "crops",
        type: "sale",
        location: "Punjab",
        seller: {
          name: "Harpreet Singh",
          rating: 4.9,
          phone: "+91 43210 98765",
        },
        images: ["/basmati-rice-grains.jpg"],
        availability: "available",
        postedDate: "2024-01-09",
        featured: true,
      },
    ]
    setItems(mockItems)
    setFilteredItems(mockItems)
  }, [])

  // Filter items based on search and filters
  useEffect(() => {
    const filtered = items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      const matchesType = selectedType === "all" || item.type === selectedType
      const matchesLocation = selectedLocation === "all" || item.location === selectedLocation

      return matchesSearch && matchesCategory && matchesType && matchesLocation
    })
    setFilteredItems(filtered)
  }, [searchTerm, selectedCategory, selectedType, selectedLocation, items])

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
        itemsRef.current?.children,
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
  }, [filteredItems])

  const categories = ["all", "equipment", "crops", "seeds", "fertilizers"]
  const types = ["all", "sale", "rent"]
  const locations = ["all", "Punjab", "Haryana", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh"]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "equipment":
        return <Tractor className="h-4 w-4" />
      case "crops":
        return <Wheat className="h-4 w-4" />
      default:
        return <ShoppingCart className="h-4 w-4" />
    }
  }

  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "fair":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const formatPrice = (price: number, type: string) => {
    if (type === "rent") {
      return `₹${price.toLocaleString()}/day`
    }
    return `₹${price.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-secondary/10">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div ref={headerRef} className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
              Farming Marketplace
            </h1>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed mb-8">
              Buy, sell, and rent farming equipment and crops. Connect with farmers and suppliers in your district for
              the best deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    List Your Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>List New Item</DialogTitle>
                    <DialogDescription>Add your equipment or crops to the marketplace</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Item title" />
                    <Textarea placeholder="Item description" />
                    <div className="grid grid-cols-2 gap-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="crops">Crops</SelectItem>
                          <SelectItem value="seeds">Seeds</SelectItem>
                          <SelectItem value="fertilizers">Fertilizers</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">For Sale</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Price (₹)" type="number" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.slice(1).map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input placeholder="Your phone number" />
                    <Button className="w-full bg-primary hover:bg-primary/90">List Item</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Browse Categories
              </Button>
            </div>
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
                  placeholder="Search items..."
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
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type === "sale" ? "For Sale" : "For Rent"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full lg:w-48">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location === "all" ? "All Locations" : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">{filteredItems.length} items found</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Items */}
      {filteredItems.some((item) => item.featured) && (
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems
                .filter((item) => item.featured)
                .slice(0, 3)
                .map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group relative overflow-hidden">
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                      </div>
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(item.category)}
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            {item.condition && (
                              <Badge className={getConditionColor(item.condition)}>{item.condition}</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{formatPrice(item.price, item.type)}</div>
                            <div className="text-xs text-muted-foreground">{item.type === "rent" ? "per day" : ""}</div>
                          </div>
                        </div>
                        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground leading-relaxed line-clamp-2">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1" />
                            {item.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(item.postedDate).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{item.seller.name}</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs text-muted-foreground ml-1">{item.seller.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={() => setSelectedItem(item)}
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* All Items Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">All Items</h2>
            <Select defaultValue="newest">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div ref={itemsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{formatPrice(item.price, item.type)}</div>
                      </div>
                    </div>
                    <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.location}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                        {item.seller.rating}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => setSelectedItem(item)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">No items found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Item Detail Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedItem.title}</DialogTitle>
              <DialogDescription className="text-lg">
                {formatPrice(selectedItem.price, selectedItem.type)}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedItem.images[0] || "/placeholder.svg"}
                  alt={selectedItem.title}
                  className="w-full aspect-video object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedItem.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Category</h4>
                    <Badge variant="outline">{selectedItem.category}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Type</h4>
                    <Badge variant="outline">{selectedItem.type === "sale" ? "For Sale" : "For Rent"}</Badge>
                  </div>
                  {selectedItem.condition && (
                    <div>
                      <h4 className="font-medium mb-1">Condition</h4>
                      <Badge className={getConditionColor(selectedItem.condition)}>{selectedItem.condition}</Badge>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedItem.location}
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Seller Information</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{selectedItem.seller.name}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        {selectedItem.seller.rating} rating
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-primary hover:bg-primary/90">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default MarketplacePage
