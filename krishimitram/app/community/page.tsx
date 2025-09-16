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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  MessageSquare,
  Calendar,
  MapPin,
  ThumbsUp,
  Reply,
  Plus,
  Search,
  Filter,
  Clock,
  Eye,
  Star,
  Phone,
  Globe,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    location: string
    reputation: number
  }
  category: string
  tags: string[]
  likes: number
  replies: number
  views: number
  createdAt: string
  isAnswered?: boolean
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  attendees: number
  maxAttendees: number
  category: "workshop" | "meeting" | "fair" | "training"
  isOnline: boolean
}

interface ChatGroup {
  id: string
  name: string
  description: string
  members: number
  category: string
  isActive: boolean
  lastMessage: {
    content: string
    timestamp: string
    author: string
  }
}

const CommunityPage = () => {
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Mock data
  useEffect(() => {
    const mockForumPosts: ForumPost[] = [
      {
        id: "1",
        title: "Best practices for organic pest control in tomatoes?",
        content:
          "I'm facing aphid problems in my tomato crop. Looking for organic solutions that won't harm beneficial insects. Any experienced farmers here with suggestions?",
        author: {
          name: "Rajesh Kumar",
          avatar: "/farmer-avatar-1.jpg",
          location: "Punjab",
          reputation: 245,
        },
        category: "Pest Control",
        tags: ["organic", "tomatoes", "aphids", "pest-control"],
        likes: 12,
        replies: 8,
        views: 156,
        createdAt: "2024-01-15T10:30:00Z",
        isAnswered: true,
      },
      {
        id: "2",
        title: "Soil pH testing - which method is most accurate?",
        content:
          "I want to test my soil pH before the next planting season. Should I use digital meters, test strips, or send samples to a lab? What's your experience?",
        author: {
          name: "Priya Sharma",
          avatar: "/farmer-avatar-2.jpg",
          location: "Haryana",
          reputation: 189,
        },
        category: "Soil Health",
        tags: ["soil", "pH", "testing", "analysis"],
        likes: 18,
        replies: 15,
        views: 234,
        createdAt: "2024-01-14T14:20:00Z",
        isAnswered: false,
      },
      {
        id: "3",
        title: "Government subsidy for drip irrigation - application process?",
        content:
          "Has anyone recently applied for the drip irrigation subsidy? I need help understanding the documentation required and the approval timeline.",
        author: {
          name: "Suresh Patil",
          avatar: "/farmer-avatar-3.jpg",
          location: "Maharashtra",
          reputation: 156,
        },
        category: "Government Schemes",
        tags: ["subsidy", "irrigation", "government", "documentation"],
        likes: 25,
        replies: 12,
        views: 298,
        createdAt: "2024-01-13T09:15:00Z",
        isAnswered: true,
      },
    ]

    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Organic Farming Workshop",
        description:
          "Learn sustainable farming practices and organic certification process. Expert speakers from agricultural universities.",
        date: "2024-01-25",
        time: "10:00 AM",
        location: "Agricultural College, Ludhiana",
        organizer: "Punjab Agricultural University",
        attendees: 45,
        maxAttendees: 100,
        category: "workshop",
        isOnline: false,
      },
      {
        id: "2",
        title: "Digital Farming Technologies Seminar",
        description:
          "Explore modern farming technologies including IoT sensors, drones, and precision agriculture techniques.",
        date: "2024-01-28",
        time: "2:00 PM",
        location: "Online Event",
        organizer: "Tech Agriculture Foundation",
        attendees: 128,
        maxAttendees: 200,
        category: "training",
        isOnline: true,
      },
      {
        id: "3",
        title: "Local Farmers Market Meet",
        description:
          "Monthly gathering of local farmers to discuss market prices, crop planning, and collaborative opportunities.",
        date: "2024-01-30",
        time: "6:00 PM",
        location: "Community Center, Chandigarh",
        organizer: "Farmers Collective",
        attendees: 67,
        maxAttendees: 80,
        category: "meeting",
        isOnline: false,
      },
    ]

    const mockChatGroups: ChatGroup[] = [
      {
        id: "1",
        name: "Rice Farmers Punjab",
        description: "Discussion group for rice farmers in Punjab region",
        members: 234,
        category: "Crop Specific",
        isActive: true,
        lastMessage: {
          content: "Anyone facing issues with brown plant hopper this season?",
          timestamp: "2024-01-15T16:45:00Z",
          author: "Harpreet Singh",
        },
      },
      {
        id: "2",
        name: "Organic Farming Community",
        description: "Share experiences and tips for organic farming practices",
        members: 456,
        category: "Farming Method",
        isActive: true,
        lastMessage: {
          content: "Great results with neem oil spray on my vegetables!",
          timestamp: "2024-01-15T15:30:00Z",
          author: "Meera Patel",
        },
      },
      {
        id: "3",
        name: "Young Farmers Network",
        description: "Platform for young and new farmers to connect and learn",
        members: 189,
        category: "General",
        isActive: true,
        lastMessage: {
          content: "Looking for mentorship in crop rotation planning",
          timestamp: "2024-01-15T14:20:00Z",
          author: "Amit Kumar",
        },
      },
    ]

    setForumPosts(mockForumPosts)
    setEvents(mockEvents)
    setChatGroups(mockChatGroups)
  }, [])

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 },
      )

      gsap.fromTo(
        statsRef.current?.children,
        { y: 30, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.4,
          stagger: 0.1,
        },
      )

      gsap.fromTo(
        contentRef.current?.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.6,
          stagger: 0.2,
        },
      )
    })

    return () => ctx.revert()
  }, [])

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Pest Control": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      "Soil Health": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      "Government Schemes": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      "Crop Management": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      Equipment: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }

  const getEventCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      workshop: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      training: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      meeting: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      fair: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-secondary/10">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <motion.div ref={headerRef} className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
              Farming Community
            </h1>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Connect with fellow farmers, share experiences, ask questions, and participate in local events. Build a
              stronger farming community together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="text-center border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">12,450</div>
                  <div className="text-sm text-muted-foreground">Active Members</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="text-center border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">3,280</div>
                  <div className="text-sm text-muted-foreground">Forum Posts</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="text-center border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">156</div>
                  <div className="text-sm text-muted-foreground">Upcoming Events</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="text-center border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">45</div>
                  <div className="text-sm text-muted-foreground">Chat Groups</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="forum" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="forum">Forum</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="chat">Chat Groups</TabsTrigger>
              <TabsTrigger value="experts">Experts</TabsTrigger>
            </TabsList>

            {/* Forum Tab */}
            <TabsContent value="forum" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search discussions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      New Discussion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Start New Discussion</DialogTitle>
                      <DialogDescription>Share your question or experience with the community</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Discussion title" />
                      <Textarea placeholder="Describe your question or share your experience..." rows={6} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Category" />
                        <Input placeholder="Tags (comma separated)" />
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90">Post Discussion</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div ref={contentRef} className="space-y-4">
                {forumPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    whileHover={{ y: -2, scale: 1.01 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                                  {post.title}
                                  {post.isAnswered && (
                                    <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                      Answered
                                    </Badge>
                                  )}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                  <span className="font-medium">{post.author.name}</span>
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {post.author.location}
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                    {post.author.reputation}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatDate(post.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {post.likes}
                                </div>
                                <div className="flex items-center">
                                  <Reply className="h-4 w-4 mr-1" />
                                  {post.replies}
                                </div>
                                <div className="flex items-center">
                                  <Eye className="h-4 w-4 mr-1" />
                                  {post.views}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
                <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Event</DialogTitle>
                      <DialogDescription>Organize a community event for farmers</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Event title" />
                      <Textarea placeholder="Event description..." rows={4} />
                      <div className="grid grid-cols-2 gap-4">
                        <Input type="date" />
                        <Input type="time" />
                      </div>
                      <Input placeholder="Location" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Max attendees" type="number" />
                        <Input placeholder="Category" />
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90">Create Event</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getEventCategoryColor(event.category)}>{event.category}</Badge>
                          {event.isOnline && (
                            <Badge variant="outline" className="text-xs">
                              Online
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-semibold text-foreground">{event.title}</CardTitle>
                        <CardDescription className="text-muted-foreground leading-relaxed">
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(event.date)} at {event.time}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            {event.attendees}/{event.maxAttendees} attendees
                          </div>
                        </div>
                        <div className="pt-3 border-t border-border/50">
                          <div className="text-sm text-muted-foreground mb-3">
                            Organized by <span className="font-medium">{event.organizer}</span>
                          </div>
                          <Button className="w-full bg-primary hover:bg-primary/90">Join Event</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Chat Groups Tab */}
            <TabsContent value="chat" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Active Chat Groups</h2>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chatGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{group.category}</Badge>
                          {group.isActive && (
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              <span className="text-xs text-green-600">Active</span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg font-semibold text-foreground">{group.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">{group.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          {group.members} members
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">Latest message:</div>
                          <div className="text-sm text-foreground line-clamp-2">{group.lastMessage.content}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            by {group.lastMessage.author} • {formatTime(group.lastMessage.timestamp)}
                          </div>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Join Chat
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Experts Tab */}
            <TabsContent value="experts" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">Agricultural Experts</h2>
                <p className="text-muted-foreground mb-8">Connect with verified agricultural experts and consultants</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "Dr. Rajesh Kumar",
                    specialization: "Organic Farming & Soil Health",
                    experience: "15+ years",
                    rating: 4.9,
                    consultations: 450,
                    location: "Punjab Agricultural University",
                  },
                  {
                    name: "Prof. Meera Sharma",
                    specialization: "Crop Disease Management",
                    experience: "12+ years",
                    rating: 4.8,
                    consultations: 320,
                    location: "IARI, New Delhi",
                  },
                  {
                    name: "Dr. Suresh Patil",
                    specialization: "Precision Agriculture",
                    experience: "10+ years",
                    rating: 4.7,
                    consultations: 280,
                    location: "Maharashtra Agricultural University",
                  },
                ].map((expert, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="text-center pb-3">
                        <Avatar className="w-20 h-20 mx-auto mb-4">
                          <AvatarImage src={`/expert-${index + 1}.jpg`} alt={expert.name} />
                          <AvatarFallback className="text-lg">{expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg font-semibold text-foreground">{expert.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">{expert.specialization}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Experience:</span>
                            <span className="font-medium">{expert.experience}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Rating:</span>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                              <span className="font-medium">{expert.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Consultations:</span>
                            <span className="font-medium">{expert.consultations}+</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground text-center">{expert.location}</div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Chat
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
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

export default CommunityPage
