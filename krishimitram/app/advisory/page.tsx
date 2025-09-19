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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Send,
  Mic,
  Camera,
  AlertTriangle,
  Droplets,
  Bug,
  Leaf,
  TrendingUp,
  Calendar,
  MapPin,
  CloudRain,
  Lightbulb,
  FileText,
  Video,
  Download,
  Sprout,
  CheckCircle,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"

gsap.registerPlugin(ScrollTrigger)

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  attachments?: string[]
}

interface Advisory {
  id: string
  title: string
  type: "disease" | "weather" | "soil" | "pest" | "nutrition"
  severity: "low" | "medium" | "high"
  description: string
  recommendation: string
  crop: string
  location: string
  date: string
}

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
}

const AdvisoryPage = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const [advisories, setAdvisories] = useState<Advisory[]>([])
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCrop, setSelectedCrop] = useState("all")
  const [diseaseFile, setDiseaseFile] = useState<File | null>(null);
const [diseaseResult, setDiseaseResult] = useState<any>(null);
const [isPredicting, setIsPredicting] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const advisoriesRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
const [cropName, setCropName] = useState("");
const {user}=useAuth();
  useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
}, [chatMessages])
  // Mock data
  useEffect(() => {
    const mockAdvisories: Advisory[] = [
      {
        id: "1",
        title: "Leaf Blight Disease Alert",
        type: "disease",
        severity: "high",
        description: "Early signs of leaf blight detected in rice crops in your area",
        recommendation: "Apply copper-based fungicide immediately. Remove affected leaves and improve drainage.",
        crop: "Rice",
        location: "Punjab",
        date: "2024-01-15",
      },
      {
        id: "2",
        title: "Heavy Rain Warning",
        type: "weather",
        severity: "medium",
        description: "Heavy rainfall expected in the next 48 hours",
        recommendation: "Ensure proper drainage in fields. Cover sensitive crops and delay fertilizer application.",
        crop: "All Crops",
        location: "Haryana",
        date: "2024-01-16",
      },
      {
        id: "3",
        title: "Soil pH Imbalance",
        type: "soil",
        severity: "medium",
        description: "Soil pH levels are below optimal range for wheat cultivation",
        recommendation: "Apply lime to increase soil pH. Test soil again after 2 weeks.",
        crop: "Wheat",
        location: "Maharashtra",
        date: "2024-01-14",
      },
    ]

    const mockTutorials: Tutorial[] = [
      {
        id: "1",
        title: "Organic Farming Basics",
        description: "Learn the fundamentals of organic farming and sustainable practices",
        category: "farming",
        type: "video",
        duration: "25 min",
        difficulty: "beginner",
        crop: "All Crops",
        season: "All Seasons",
        thumbnail: "/organic-farming-tutorial.jpg",
        url: "#",
      },
      {
        id: "2",
        title: "Crop Rotation Techniques",
        description: "Master the art of crop rotation for better soil health and yield",
        category: "farming",
        type: "video",
        duration: "18 min",
        difficulty: "intermediate",
        crop: "All Crops",
        season: "All Seasons",
        thumbnail: "/crop-rotation-guide.jpg",
        url: "#",
      },
      {
        id: "3",
        title: "Using KrishiMitram App",
        description: "Complete guide to using all features of the KrishiMitram platform",
        category: "app",
        type: "video",
        duration: "12 min",
        difficulty: "beginner",
        thumbnail: "/app-tutorial-guide.jpg",
        url: "#",
      },
      {
        id: "4",
        title: "Pest Management Guide",
        description: "Comprehensive PDF guide on identifying and managing common pests",
        category: "farming",
        type: "pdf",
        difficulty: "intermediate",
        crop: "Vegetables",
        season: "Summer",
        thumbnail: "/pest-management-pdf.jpg",
        url: "#",
      },
    ]

    setAdvisories(mockAdvisories)
    setTutorials(mockTutorials)

    // Initial AI greeting
    setChatMessages([
      {
        id: "1",
        type: "ai",
        content:
          "Hello! I'm your AI farming assistant. I can help you with crop diseases, weather advice, soil health, and farming techniques. How can I assist you today?",
        timestamp: new Date(),
      },
    ])
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
        chatRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.4 },
      )

      gsap.fromTo(
        advisoriesRef.current?.children,
        { y: 30, opacity: 0, scale: 0.95 },
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
  }, [])

const handleSendMessage = async () => {
  if (!currentMessage.trim()) return

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    type: "user",
    content: currentMessage,
    timestamp: new Date(),
  }

  setChatMessages((prev) => [...prev, userMessage])
  setCurrentMessage("")
  setIsTyping(true)

  try {
    const contentLower = userMessage.content.toLowerCase()
    let finalText: string = ""

    if (contentLower.startsWith("recommend")) {
      // --- Step 1: Get recommendation from :8000 ---
      const [_, crop, , district] = userMessage.content.split(" ")
      const res = await fetch(
        `https://recommendationapis.onrender.com/recommend?district=${district}&crop=${crop}`,
      )
      const data = await res.json()
      console.log("Backend Data:", data)
      const backendText = `Recommendation for ${data.crop} in ${data.district}: ${data.recommendation}`

      // --- Step 2: Improve with chatbot on :8001 ---
      const aiRes = await fetch("https://chatbot-j7e1.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: backendText }),
      })
      const aiData = await aiRes.json()
      finalText = aiData?.response?.answer || backendText

    } else if (contentLower.startsWith("best crop")) {
      // --- Step 1: Get best crop from :8000 ---
      const district = userMessage.content.split("in")[1].trim()
      const res = await fetch(
        `https://recommendationapis.onrender.com/best_crop?district=${district}`,
      )
      const data = await res.json()
      const backendText = `Best crop for ${data.district}: ${data.best_crop}`

      // --- Step 2: Improve with chatbot on :8001 ---
      const aiRes = await fetch("https://chatbot-j7e1.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: backendText }),
      })
      const aiData = await aiRes.json()
      finalText = aiData?.response?.answer || backendText

    } else {
      // --- Directly send user query to chatbot on :8001 ---
      const aiRes = await fetch("https://chatbot-j7e1.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      })
      const aiData = await aiRes.json()
      console.log("AI Data", aiData)
      finalText = aiData?.response?.answer || "⚠️ Could not get a response from chatbot."
    }

    // --- Push AI response ---
    setChatMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: finalText,
        timestamp: new Date(),
      },
    ])
  } catch (err) {
    console.error("Error calling API:", err)
    setChatMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "⚠️ Error contacting backend/chatbot. Please try again.",
        timestamp: new Date(),
      },
    ])
  } finally {
    setIsTyping(false)
  }
}

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes("disease") || lowerMessage.includes("pest")) {
      return "Based on your description, it sounds like you might be dealing with a common crop disease. Can you share a photo of the affected plant? In the meantime, ensure good air circulation and avoid overhead watering."
    }
    if (lowerMessage.includes("weather") || lowerMessage.includes("rain")) {
      return "Weather conditions are crucial for farming decisions. Based on current forecasts, I recommend checking soil moisture levels and adjusting your irrigation schedule accordingly. Would you like specific advice for your crop type?"
    }
    if (lowerMessage.includes("soil") || lowerMessage.includes("fertilizer")) {
      return "Soil health is fundamental to successful farming. I recommend conducting a soil test to check pH levels and nutrient content. Based on your crop type and soil conditions, I can suggest appropriate fertilization strategies."
    }
    return "Thank you for your question! I'm here to help with all your farming needs. Could you provide more specific details about your crop, location, and the issue you're facing? This will help me give you more targeted advice."
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "disease":
        return <Bug className="h-4 w-4" />
      case "weather":
        return <CloudRain className="h-4 w-4" />
      case "soil":
        return <Leaf className="h-4 w-4" />
      case "pest":
        return <Bug className="h-4 w-4" />
      case "nutrition":
        return <Droplets className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

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

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesCategory = selectedCategory === "all" || tutorial.category === selectedCategory
    const matchesCrop = selectedCrop === "all" || tutorial.crop === selectedCrop || tutorial.crop === "All Crops"
    return matchesCategory && matchesCrop
  })

  const handleDiseasePrediction = async () => {
  if (!diseaseFile) return;
  setIsPredicting(true);
  const formData = new FormData();
  formData.append("file", diseaseFile);
formData.append("crop", cropName);

  try {
    const res = await fetch("http://184.72.123.71:8000/predict", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log("Disease Prediction Result:", data);
    setDiseaseResult(data);
  } catch (err) {
    console.error("Error predicting disease:", err);
    setDiseaseResult({ error: "Failed to predict disease." });
  } finally {
    setIsPredicting(false);
  }
};

const handleEscalate = async (message: ChatMessage) => {
  console.log(user);
  try {
    const res = await fetch("https://krishimitram-server.onrender.com/query/createquery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
       
        userId: user?.user?._id,
        geolocation: user?.user?.geolocation || "Unknown",
        query: message.content,
      }),
    });

    if (!res.ok) throw new Error("Failed to escalate");
    alert("✅ Query escalated successfully!");
  } catch (err) {
    console.error("Escalate error:", err);
    alert("⚠️ Failed to escalate query. Try again.");
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-secondary/10">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <motion.div ref={headerRef} className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
              AI Advisory & Tutorials
            </h1>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed">
              Get personalized farming advice powered by AI and access comprehensive tutorials to improve your farming
              techniques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="ai-chat" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
              <TabsTrigger value="disease-detector">Disease Detector</TabsTrigger>
              <TabsTrigger value="advisories">Advisories</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            </TabsList>

            {/* AI Chat Tab */}
            <TabsContent value="ai-chat" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat Interface */}
                <div className="lg:col-span-2">
                  <Card ref={chatRef} className="h-[600px] flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Brain className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">AI Farming Assistant</CardTitle>
                            <CardDescription>Multilingual support available</CardDescription>
                          </div>
                        </div>
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="malayalam">മലയാളം</SelectItem>
                            <SelectItem value="hindi">हिंदी</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
  {/* Messages */}
  {/* Messages */}
<div className="flex-1 overflow-y-auto space-y-4 mb-4">
  {chatMessages.map((message) => (
    <div
      key={message.id}
      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          message.type === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {message.type === "ai" ? (
  <ul className="list-disc list-inside text-sm space-y-1">
    {message.content
      .split("*")
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line, index) => (
        <li key={index}>{line}</li>
      ))}
  </ul>
) : (
  <p className="text-sm">{message.content}</p>
)}

        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
        {message.type === "ai" && (
  <div className="flex justify-start mt-1">
    <Button
      variant="outline"
      size="xs"
      className="text-xs"
      onClick={() => handleEscalate(message)}
    >
      Escalate
    </Button>
  </div>
)}

      </div>
    </div>
  ))}
  {isTyping && (
    <div className="flex justify-start">
      <div className="bg-muted text-muted-foreground p-3 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  )}
  <div ref={chatEndRef} />
</div>


  {/* Input */}
  <div className="flex items-center space-x-2">
    <Button variant="outline" size="icon">
      <Camera className="h-4 w-4" />
    </Button>
    <Button variant="outline" size="icon">
      <Mic className="h-4 w-4" />
    </Button>
    <Input
      placeholder="Ask about crops, diseases, weather..."
      value={currentMessage}
      onChange={(e) => setCurrentMessage(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      className="flex-1"
    />
    <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90">
      <Send className="h-4 w-4" />
    </Button>
  </div>
</CardContent>

                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => setCurrentMessage("Help me identify a crop disease")}
                      >
                        <Bug className="h-4 w-4 mr-2" />
                        Disease Diagnosis
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => setCurrentMessage("What's the weather forecast for farming?")}
                      >
                        <CloudRain className="h-4 w-4 mr-2" />
                        Weather Advice
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => setCurrentMessage("How can I improve my soil health?")}
                      >
                        <Leaf className="h-4 w-4 mr-2" />
                        Soil Health
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => setCurrentMessage("Suggest fertilizers for my crop")}
                      >
                        <Droplets className="h-4 w-4 mr-2" />
                        Nutrition Advice
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => setCurrentMessage("Recommend Rice in Thrissur")}
                      >
                        <Sprout className="h-4 w-4 mr-2" />
                        Recommendation for Crops
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => setCurrentMessage("Best crop in Thrissur")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Best Crop Suggestion
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Today's Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Morning Irrigation</p>
                            <p className="text-xs text-muted-foreground">
                              Water your crops early morning for better absorption
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Crop Rotation</p>
                            <p className="text-xs text-muted-foreground">Plan your next season's crop rotation now</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            {/* Disease Detector Tab */}
            

<TabsContent value="disease-detector" className="space-y-6">
  <div className="max-w-lg mx-auto space-y-4">
    <h2 className="text-2xl font-bold text-foreground text-center">
      Crop Disease Detector
    </h2>

    {/* Crop name input */}
    <Input
      type="text"
      placeholder="Enter crop name (e.g. rice, banana)"
      value={cropName}
      onChange={(e) => setCropName(e.target.value)}
    />

    {/* File input for image */}
    <Input
      type="file"
      accept="image/*"
      onChange={(e) => setDiseaseFile(e.target.files?.[0] || null)}
    />

    {/* Image preview */}
    {diseaseFile && (
      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Preview:</p>
        <img
          src={URL.createObjectURL(diseaseFile)}
          alt="Uploaded crop"
          className="w-full h-64 object-cover rounded-lg border"
        />
      </div>
    )}

    {/* Predict button */}
    <Button
      onClick={handleDiseasePrediction}
      disabled={!diseaseFile || !cropName || isPredicting}
      className="w-full bg-primary hover:bg-primary/90"
    >
      {isPredicting ? "Predicting..." : "Predict Disease"}
    </Button>

    {/* Prediction results */}
    {diseaseResult && (
      <Card className="p-4 border border-border/50">
        {diseaseResult.error ? (
          <p className="text-red-500">{diseaseResult.error}</p>
        ) : (
          <>
            <p><strong>Crop:</strong> {diseaseResult.crop}</p>
            <p><strong>Model Used:</strong> {diseaseResult.model_used}</p>
            <p><strong>Predicted Disease:</strong> {diseaseResult.predicted_disease}</p>
            <p><strong>Confidence:</strong> {(diseaseResult.confidence * 100).toFixed(2)}%</p>
          </>
        )}
      </Card>
    )}
  </div>
</TabsContent>



            {/* Advisories Tab */}
            <TabsContent value="advisories" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Current Advisories</h2>
                <Badge variant="outline" className="text-sm">
                  {advisories.length} active alerts
                </Badge>
              </div>

              <div ref={advisoriesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisories.map((advisory) => (
                  <motion.div
                    key={advisory.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(advisory.type)}
                            <Badge variant="outline" className="text-xs">
                              {advisory.type}
                            </Badge>
                          </div>
                          <Badge className={getSeverityColor(advisory.severity)}>{advisory.severity}</Badge>
                        </div>
                        <CardTitle className="text-lg font-semibold text-foreground">{advisory.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">{advisory.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-sm mb-1">Recommendation:</h4>
                          <p className="text-sm text-muted-foreground">{advisory.recommendation}</p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Leaf className="h-4 w-4 mr-1" />
                            {advisory.crop}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {advisory.location}
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(advisory.date).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Learning Resources</h2>
                <div className="flex gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="farming">Farming Tutorials</SelectItem>
                      <SelectItem value="app">App Tutorials</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger className="w-48">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutorials.map((tutorial) => (
                  <motion.div
                    key={tutorial.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={tutorial.thumbnail || "/placeholder.svg"}
                          alt={tutorial.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          {tutorial.type === "video" ? (
                            <Badge className="bg-red-500 text-white">
                              <Video className="h-3 w-3 mr-1" />
                              Video
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-500 text-white">
                              <FileText className="h-3 w-3 mr-1" />
                              PDF
                            </Badge>
                          )}
                        </div>
                        {tutorial.duration && (
                          <div className="absolute bottom-2 right-2">
                            <Badge variant="secondary" className="text-xs">
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
                        <CardDescription className="text-muted-foreground leading-relaxed line-clamp-2">
                          {tutorial.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
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
                        <div className="flex gap-2">
                          <Button className="flex-1 bg-primary hover:bg-primary/90">
                            {tutorial.type === "video" ? (
                              <>
                                <Video className="h-3 w-3 mr-1" />
                                Watch
                              </>
                            ) : (
                              <>
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </>
                            )}
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

export default AdvisoryPage
