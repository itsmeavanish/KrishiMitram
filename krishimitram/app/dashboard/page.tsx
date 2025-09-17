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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Plus,
  Calendar,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  Sprout,
  TrendingUp,
  Activity,
  AlertTriangle,
  User,
  MapPin,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface ActivityLog {
  id: string
  date: string
  activity: string
  crop: string
  description: string
  status: "completed" | "in-progress" | "planned"
  duration: number
}

interface WeatherAlert {
  event: string;        // e.g., "Heavy Rainfall", "Thunderstorm"
  description: string;  // full details of the alert
  severity: string;     // e.g., "moderate", "severe", "extreme"
  start: string | null; // local start time of the alert
  end: string | null;   // local end time of the alert
}

interface WeatherData {
  current: {
    day: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    location: string;
  };
  forecast: Array<{
    day: string;
    temperature: number;
    condition: string;
  }>;
  alerts: WeatherAlert[]; // array of weather alerts
}



interface CropProgress {
  crop: string
  stage: string
  progress: number
  expectedHarvest: string
  health: "excellent" | "good" | "fair" | "poor"
}

const DashboardPage = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);


  // 🔥 Fetch + transform weather data
  async function fetchWeather(lat: number, lng: number) {
    // 1. Fetch current weather from Ambee
    const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
    if (!res.ok) throw new Error("Failed to fetch weather");

    const json = await res.json();
    const data = json.data;

    // Convert values from Ambee
    const tempCelsius = ((data.temperature - 32) * 5) / 9; // °F → °C
    const windKmh = data.windSpeed * 1.60934; // mph → km/h

    // Days of week
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayIndex = new Date().getDay();
    const locationRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const locationData = await locationRes.json();
    const locationName = locationData.address?.city
      || locationData.address?.town
      || locationData.address?.village
      || locationData.address?.state
      || "Unknown Location";
    // Current weather (from Ambee)
    const current = {
      day: days[todayIndex],
      temperature: Number(tempCelsius.toFixed(1)),
      condition: data.summary || "Unknown",
      humidity: data.humidity,
      windSpeed: Number(windKmh.toFixed(1)),
      location: locationName,
    };



    // 2. Fetch forecast + alerts from Open-Meteo
    const forecastRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&alerts=true`
    );
    if (!forecastRes.ok) throw new Error("Failed to fetch forecast");

    const forecastJson = await forecastRes.json();

    // 3. Build forecast array (next 5 days)
    const forecast = forecastJson.daily.time.slice(1, 6).map((date: string, i: number) => {
      const idx = (todayIndex + i + 1) % 7;
      return {
        day: days[idx],
        temperature: Number(forecastJson.daily.temperature_2m_max[i + 1].toFixed(1)),
        condition: mapWeatherCode(forecastJson.daily.weathercode[i + 1]),
      };
    });

    // 4. Extract alerts (if present)
    const alerts = (forecastJson.alerts?.map((a: any) => ({
      event: a.event,                       // e.g. "Heavy Rainfall"
      description: a.description || "No details",
      severity: a.severity || "moderate",
      start: a.onset ? new Date(a.onset).toLocaleString() : null,
      end: a.expires ? new Date(a.expires).toLocaleString() : null,
    }))) || [];


    return { current, forecast, alerts };
  }

  // Helper: map Open-Meteo weather codes to human-readable text
  function mapWeatherCode(code: number): string {
    const mapping: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      95: "Thunderstorm",
    };
    return mapping[code] || "Unknown";
  }




  // ---------------------------------------------------------

  // Run once when component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lng: longitude });

          // Fetch weather API after getting location
          fetchWeather(latitude, longitude).then((data) => {
            setWeatherData(data);
            console.log("✅ Final Weather Data:", data);

          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Your location is not available, please change your settings to allow");
    }
  }, []);

  const [newActivity, setNewActivity] = useState({
    activity: "",
    crop: "",
    description: "",
    duration: 0,
  })

  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const chartsRef = useRef<HTMLDivElement>(null)

  const cropProgress: CropProgress[] = [
    {
      crop: "Rice",
      stage: "Flowering",
      progress: 75,
      expectedHarvest: "2024-12-15",
      health: "excellent",
    },
    {
      crop: "Wheat",
      stage: "Germination",
      progress: 25,
      expectedHarvest: "2025-04-20",
      health: "good",
    },
    {
      crop: "Tomatoes",
      stage: "Fruiting",
      progress: 60,
      expectedHarvest: "2024-11-30",
      health: "fair",
    },
  ]

  const weeklyData = [
    { day: "Mon", hours: 6, tasks: 4 },
    { day: "Tue", hours: 8, tasks: 6 },
    { day: "Wed", hours: 5, tasks: 3 },
    { day: "Thu", hours: 7, tasks: 5 },
    { day: "Fri", hours: 6, tasks: 4 },
    { day: "Sat", hours: 9, tasks: 7 },
    { day: "Sun", hours: 4, tasks: 2 },
  ]

  const monthlyProgress = [
    { month: "Jan", yield: 85 },
    { month: "Feb", yield: 78 },
    { month: "Mar", yield: 92 },
    { month: "Apr", yield: 88 },
    { month: "May", yield: 95 },
    { month: "Jun", yield: 82 },
  ]

  const activityDistribution = [
    { name: "Irrigation", value: 30, color: "#4A7C2B" },
    { name: "Fertilizing", value: 25, color: "#BFAF8D" },
    { name: "Pest Control", value: 20, color: "#8FBC8F" },
    { name: "Harvesting", value: 15, color: "#DEB887" },
    { name: "Other", value: 10, color: "#F4A460" },
  ]

  useEffect(() => {
    // Mock activities data
    const mockActivities: ActivityLog[] = [
      {
        id: "1",
        date: "2024-01-15",
        activity: "Irrigation",
        crop: "Rice",
        description: "Watered the rice fields in the morning",
        status: "completed",
        duration: 2,
      },
      {
        id: "2",
        date: "2024-01-15",
        activity: "Fertilizing",
        crop: "Wheat",
        description: "Applied organic fertilizer to wheat crop",
        status: "completed",
        duration: 3,
      },
      {
        id: "3",
        date: "2024-01-16",
        activity: "Pest Control",
        crop: "Tomatoes",
        description: "Sprayed natural pesticide on tomato plants",
        status: "in-progress",
        duration: 1.5,
      },
    ]
    setActivities(mockActivities)
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
        chartsRef.current?.children,
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

  const handleAddActivity = () => {
    if (newActivity.activity && newActivity.crop) {
      const activity: ActivityLog = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        activity: newActivity.activity,
        crop: newActivity.crop,
        description: newActivity.description,
        status: "completed",
        duration: newActivity.duration,
      }
      setActivities([activity, ...activities])
      setNewActivity({ activity: "", crop: "", description: "", duration: 0 })
      setIsAddingActivity(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-5 w-5 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-5 w-5 text-blue-500" />
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "text-green-600 bg-green-100 dark:bg-green-900/20"
      case "good":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20"
      case "fair":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
      case "poor":
        return "text-red-600 bg-red-100 dark:bg-red-900/20"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "planned":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-secondary/10">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            ref={headerRef}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Activity Dashboard</h1>
              <p className="text-xl text-muted-foreground">Track your farming activities and monitor crop progress</p>
            </div>
            <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Activity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log New Activity</DialogTitle>
                  <DialogDescription>Record your farming activity for today</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Select
                    value={newActivity.activity}
                    onValueChange={(value) => setNewActivity({ ...newActivity, activity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Irrigation">Irrigation</SelectItem>
                      <SelectItem value="Fertilizing">Fertilizing</SelectItem>
                      <SelectItem value="Pest Control">Pest Control</SelectItem>
                      <SelectItem value="Harvesting">Harvesting</SelectItem>
                      <SelectItem value="Planting">Planting</SelectItem>
                      <SelectItem value="Weeding">Weeding</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Crop name"
                    value={newActivity.crop}
                    onChange={(e) => setNewActivity({ ...newActivity, crop: e.target.value })}
                  />
                  <Textarea
                    placeholder="Activity description"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Duration (hours)"
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity({ ...newActivity, duration: Number.parseFloat(e.target.value) })}
                  />
                  <Button onClick={handleAddActivity} className="w-full bg-primary hover:bg-primary/90">
                    Log Activity
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/** Each card wrapper */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="h-full"
            >
              <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {"Rajesh Kumar"}
                      </CardTitle>
                    </div>
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getWeatherIcon(weatherData?.forecast[0].condition || "Unknown")}
                      <div>
                        <div className="text-xl font-bold text-foreground">
                          {weatherData?.current?.temperature}°C
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {weatherData?.current?.condition.split(".")[0]}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 mt-3">
                    <MapPin />
                    <p className="text-xs text-muted-foreground">
                      Location: {weatherData?.current?.location || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/** Repeat motion.div for other cards with same classes */}
            <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
              <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Activities</CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <div className="text-2xl font-bold text-foreground">Total 3</div>
                  <p className="text-xs text-muted-foreground">2 of 3 is completed</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
              <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Crops</CardTitle>
                    <Sprout className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <p className="text-xs text-muted-foreground">2 ready for harvest</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
              <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Weather Alert</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 overflow-y-auto">
                  {weatherData?.alerts && weatherData?.alerts.length > 0 ? (
                    weatherData?.alerts.map((a, index) => (
                      <div key={index} className="p-3 rounded-lg bg-red-100 border border-red-300">
                        <div className="text-lg font-bold text-red-700">{a.event}</div>
                        <p className="text-sm text-muted-foreground mb-1">{a.description}</p>
                        <div className="text-xs text-red-600">
                          Severity: <span className="font-semibold">{a.severity}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Start: {a.start || "N/A"} | End: {a.end || "N/A"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No weather alerts</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="crops">Crops</TabsTrigger>
              <TabsTrigger value="weather">Weather</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Activity Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                    <CardDescription>Hours worked and tasks completed this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="hours" fill="var(--color-primary)" />
                        <Bar dataKey="tasks" fill="var(--color-secondary)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Monthly Progress Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Progress</CardTitle>
                    <CardDescription>Crop yield progress over the months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="yield" stroke="var(--color-primary)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Activity Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Distribution</CardTitle>
                    <CardDescription>Time spent on different farming activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={activityDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {activityDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Your latest farming activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{activity.activity}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.crop} • {activity.duration}h
                            </div>
                          </div>
                          <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activities" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Complete history of your farming activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{activity.activity}</h3>
                            <p className="text-sm text-muted-foreground">
                              {activity.crop} • {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        <div className="text-xs text-muted-foreground">Duration: {activity.duration} hours</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crops" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cropProgress.map((crop, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.02, y: -4 }}>
                    <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{crop.crop}</CardTitle>
                          <Badge className={getHealthColor(crop.health)}>{crop.health}</Badge>
                        </div>
                        <CardDescription>Stage: {crop.stage}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{crop.progress}%</span>
                          </div>
                          <Progress value={crop.progress} className="h-2" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Expected harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weather" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Weather */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Weather</CardTitle>
                    <CardDescription>Real-time weather conditions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getWeatherIcon(weatherData?.current?.condition || "Unknown")}
                        <div>
                          <div className="text-3xl font-bold text-foreground">{weatherData?.current?.temperature}°C</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {weatherData?.current?.condition}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                      <div className="text-center">
                        <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                        <div className="text-sm font-medium">{weatherData?.current?.humidity}%</div>
                        <div className="text-xs text-muted-foreground">Humidity</div>
                      </div>
                      <div className="text-center">
                        <Wind className="h-5 w-5 text-gray-500 mx-auto mb-1" />
                        <div className="text-sm font-medium">{weatherData?.current?.windSpeed} km/h</div>
                        <div className="text-xs text-muted-foreground">Wind</div>
                      </div>
                      <div className="text-center">
                        <Thermometer className="h-5 w-5 text-red-500 mx-auto mb-1" />
                        <div className="text-sm font-medium">{weatherData?.current?.temperature}°C</div>
                        <div className="text-xs text-muted-foreground">Temp</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weather Forecast */}
                <Card>
                  <CardHeader>
                    <CardTitle>5-Day Forecast</CardTitle>
                    <CardDescription>Weather predictions for the week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {weatherData?.forecast.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center space-x-3">
                            {getWeatherIcon(day?.condition)}
                            <span className="font-medium">{day?.day}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{day?.temperature}°C</div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {day?.condition}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage