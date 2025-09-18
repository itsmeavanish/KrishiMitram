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
import { useAuth } from "../context/AuthContext"
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
  Globe,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface Answer {
  userId: string
  userRole: string
  text: string
  createdAt: string
}

interface Qna {
  _id: string
  subject: string
  body: string
  category: string
  tags?: string[]
  type: string
  createdAt: string
  authorId?: any // populated object or id
  answers: Answer[]
}

const API_BASE = "http://localhost:5000/api/qna" // <<— change to your backend URL
const LOGGED_IN_USER_ID = "USER_ID_HERE" // <<— replace with actual logged-in user id

const CommunityPage = () => {
  const [qnas, setQnas] = useState<Qna[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [dialogForType, setDialogForType] = useState<"farmer-farmer" | "farmer-shopowner">("farmer-farmer")
  const [newQuestion, setNewQuestion] = useState({
    subject: "",
    body: "",
    category: "Pest Control",
    tags: "",
    type: "farmer-farmer",
  })
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({})
  const { user, loading } = useAuth();

  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // fetch and normalize response into an array
  const fetchQnas = async () => {
    try {
      const res = await fetch(API_BASE)
      const data = await res.json()

      // Normalize: handle different shapes gracefully
      if (Array.isArray(data)) {
        setQnas(data)
      } else if (data && Array.isArray(data.qnas)) {
        setQnas(data.qnas)
      } else if (data && Array.isArray(data.questions)) {
        setQnas(data.questions)
      } else if (data && data.question) {
        // single object — wrap it
        setQnas([data.question])
      } else {
        // fallback to empty array
        setQnas([])
      }
      console.log(data);

    } catch (err) {
      console.error("Error fetching QnAs:", err)
      setQnas([])
    }
  }

  useEffect(() => {
    fetchQnas()
  }, [])

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 })
      gsap.fromTo(
        statsRef.current?.children,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.4, stagger: 0.1 }
      )
      gsap.fromTo(
        contentRef.current?.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.6, stagger: 0.2 }
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
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })

  // Open new question dialog and preset the type (so posting happens in current tab)
  const openNewQuestionDialog = (type: "farmer-farmer" | "farmer-shopowner") => {
    setDialogForType(type)
    setNewQuestion((prev) => ({ ...prev, type }))
    setIsCreatingPost(true)
  }

  // Post question
  const handlePostQuestion = async () => {
    if (!user) {
      alert("You must be logged in to post a question.");
      return;
    }

    try {
      const payload = {
        subject: newQuestion.subject,
        body: newQuestion.body,
        category: newQuestion.category,
        type: newQuestion.type,
        tags: newQuestion.tags ? newQuestion.tags.split(",").map((t) => t.trim()) : [],
        authorId: user.user._id, // ✅ from context
      };
      console.log(payload);


      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to post question");
      }

      // refresh and reset
      setNewQuestion({
        subject: "",
        body: "",
        category: "Pest Control",
        tags: "",
        type: dialogForType,
      });
      setIsCreatingPost(false);
      await fetchQnas();
    } catch (err: any) {
      console.error("Error posting question:", err);
      // optionally show toast / UI message
    }
  };


  // Add an answer
  const handleAddAnswer = async (id: string) => {
    if (!user) {
      alert("You must be logged in to post an answer.");
      return;
    }

    if (!answerText[id] || answerText[id].trim() === "") return;

    try {
      const res = await fetch(`${API_BASE}/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.user._id,     // ✅ from context
          userRole: user.user.role,   // ✅ from context
          text: answerText[id],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to post answer");
      }

      setAnswerText((prev) => ({ ...prev, [id]: "" }));
      await fetchQnas();
    } catch (err) {
      console.error("Error posting answer:", err);
    }
  };


  // Safely compute total answers
  const totalAnswers = Array.isArray(qnas) ? qnas.reduce((acc, q) => acc + (Array.isArray(q.answers) ? q.answers.length : 0), 0) : 0

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
                  <div className="text-2xl font-bold">{/* Active members - static or fetch from API */}12,450</div>
                  <div className="text-sm text-muted-foreground">Active Members</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="text-center border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Array.isArray(qnas) ? qnas.length : 0}</div>
                  <div className="text-sm text-muted-foreground">Forum Posts</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="text-center border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{totalAnswers}</div>
                  <div className="text-sm text-muted-foreground">Answers Shared</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, y: -4 }}>
              <Card className="text-center border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">45</div>
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
          <Tabs defaultValue="farmer-farmer" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="farmer-farmer">Farmers</TabsTrigger>
              <TabsTrigger value="farmer-shopowner">Farmers & Shopowners</TabsTrigger>
              <TabsTrigger value="my-posts">My Posts</TabsTrigger>
            </TabsList>

            {(["farmer-farmer", "farmer-shopowner"] as const).map((type) => (
              <TabsContent key={type} value={type} className="space-y-6">
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

                  {/* New Question (preset to current tab type) */}
                  <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => openNewQuestionDialog(type)}
                      >
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
                        <Input
                          placeholder="Discussion title"
                          value={newQuestion.subject}
                          onChange={(e) => setNewQuestion((p) => ({ ...p, subject: e.target.value }))}
                        />
                        <Textarea
                          placeholder="Describe your question or share your experience..."
                          rows={6}
                          value={newQuestion.body}
                          onChange={(e) => setNewQuestion((p) => ({ ...p, body: e.target.value }))}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <select
                            className="border p-2 rounded"
                            value={newQuestion.category}
                            onChange={(e) => setNewQuestion((p) => ({ ...p, category: e.target.value }))}
                          >
                            <option>Pest Control</option>
                            <option>Soil Health</option>
                            <option>Government Schemes</option>
                            <option>Crop Management</option>
                          </select>
                          <Input
                            placeholder="Tags (comma separated)"
                            value={newQuestion.tags}
                            onChange={(e) => setNewQuestion((p) => ({ ...p, tags: e.target.value }))}
                          />
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90" onClick={handlePostQuestion}>
                          Post Discussion
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Questions List */}
                <div ref={contentRef} className="space-y-4">
                  {Array.isArray(qnas) &&
                    qnas
                      .filter((q) => q.type === type && q.subject.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((post) => (
                        <motion.div
                          key={post._id}
                          whileHover={{ y: -2, scale: 1.01 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={post.authorId?.avatar || "/placeholder.svg"} alt={post.authorId?.name || "User"} />
                                  <AvatarFallback>{(post.authorId?.name || "U").charAt(0)}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                                        {post.subject}
                                      </h3>
                                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                        <span className="font-medium">{post.authorId?.name || "Unknown"}</span>
                                        <div className="flex items-center">
                                          <MapPin className="h-3 w-3 mr-1" />
                                          {post.authorId?.location || "—"}
                                        </div>
                                        <div className="flex items-center">
                                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                          {post.authorId?.reputation ?? "—"}
                                        </div>
                                        <div className="flex items-center">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {formatDate(post.createdAt)}
                                        </div>
                                      </div>
                                    </div>

                                    <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                                  </div>

                                  <p className="text-muted-foreground leading-relaxed">{post.body}</p>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <div className="flex items-center">
                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                        {/* Likes not implemented yet */}
                                        0
                                      </div>
                                      <div className="flex items-center">
                                        <Reply className="h-4 w-4 mr-1" />
                                        {Array.isArray(post.answers) ? post.answers.length : 0}
                                      </div>
                                      <div className="flex items-center">
                                        <Eye className="h-4 w-4 mr-1" />
                                        {/* views not implemented yet */}
                                        0
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                      {post.tags?.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Answers */}
                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium">Answers</h4>
                                    <div className="space-y-2 mt-2">
                                      {Array.isArray(post.answers) && post.answers.length ? (
                                        post.answers.map((ans, idx) => (
                                          <div key={idx} className="text-sm bg-surface/40 p-2 rounded">
                                            <div className="font-semibold text-xs">{ans.userRole}</div>
                                            <div>{ans.text}</div>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="text-sm text-muted-foreground">No answers yet</div>
                                      )}
                                    </div>

                                    {/* Add Answer */}
                                    <div className="mt-3">
                                      {(user?.user?._id !== post?.authorId?._id) &&
                                        !(post.type === "farmer-shopowner" && user?.user?.role === "farmer") && (
                                          <div>
                                            <Textarea
                                              placeholder="Write your answer..."
                                              value={answerText[post._id] || ""}
                                              onChange={(e) => setAnswerText((prev) => ({ ...prev, [post._id]: e.target.value }))}
                                              rows={2}
                                            />
                                            <Button className="mt-2 bg-primary" onClick={() => handleAddAnswer(post._id)}>
                                              Post Answer
                                            </Button>
                                          </div>
                                        )}


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
            ))}
            <TabsContent value="my-posts" className="space-y-6">
              <div ref={contentRef} className="space-y-4">
                {Array.isArray(qnas) &&
                  qnas
                    .filter((q) => q.authorId?._id === user?.user?._id) // only my posts
                    .map((post) => (
                      <motion.div
                        key={post._id}
                        whileHover={{ y: -2, scale: 1.01 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={post.authorId?.avatar || "/placeholder.svg"} alt={post.authorId?.name || "User"} />
                                <AvatarFallback>{(post.authorId?.name || "U").charAt(0)}</AvatarFallback>
                              </Avatar>

                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                                      {post.subject}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                      <span className="font-medium">{post.authorId?.name || "Unknown"}</span>
                                      <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {post.authorId?.location || "—"}
                                      </div>
                                      <div className="flex items-center">
                                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                        {post.authorId?.reputation ?? "—"}
                                      </div>
                                      <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {formatDate(post.createdAt)}
                                      </div>
                                    </div>
                                  </div>

                                  <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                                </div>

                                <p className="text-muted-foreground leading-relaxed">{post.body}</p>

                                {/* Answers */}
                                <div className="mt-4">
                                  <h4 className="text-sm font-medium">Answers</h4>
                                  <div className="space-y-2 mt-2">
                                    {Array.isArray(post.answers) && post.answers.length ? (
                                      post.answers.map((ans, idx) => (
                                        <div key={idx} className="text-sm bg-surface/40 p-2 rounded">
                                          <div className="font-semibold text-xs">{ans.userRole}</div>
                                          <div>{ans.text}</div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-sm text-muted-foreground">No answers yet</div>
                                    )}
                                  </div>

                                  {/* No option to add answer on My Posts */}
                                </div>
                              </div>
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
