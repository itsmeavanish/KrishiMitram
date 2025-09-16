"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  Camera,
  Edit3,
  Save,
  X,
  Leaf,
  TrendingUp,
  MessageSquare,
  Star,
  Users,
} from "lucide-react"
import { gsap } from "gsap"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    gsap.fromTo(".profile-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 })
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsEditing(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your account and farming preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="profile-card border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/farmer-avatar-1.jpg" />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl">RK</AvatarFallback>
                    </Avatar>
                    <button className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors">
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>

                  <h2 className="text-xl font-semibold text-slate-800 mb-1">Rajesh Kumar</h2>
                  <p className="text-slate-600 mb-2">Organic Farmer</p>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                    <Leaf className="w-3 h-3 mr-1" />
                    Verified Farmer
                  </Badge>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      Pune, Maharashtra
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Member since 2023
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Award className="w-4 h-4 mr-2" />
                      15 years experience
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="profile-card border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600 mr-2" />
                    <span className="text-sm text-slate-600">Crops Grown</span>
                  </div>
                  <span className="font-semibold text-slate-800">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-slate-600">Forum Posts</span>
                  </div>
                  <span className="font-semibold text-slate-800">48</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-amber-500 mr-2" />
                    <span className="text-sm text-slate-600">Rating</span>
                  </div>
                  <span className="font-semibold text-slate-800">4.8/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm text-slate-600">Connections</span>
                  </div>
                  <span className="font-semibold text-slate-800">156</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="profile-card border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-800">Profile Information</CardTitle>
                  <CardDescription>Update your personal and farming details</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
                  className={isEditing ? "border-slate-300 text-slate-700" : "bg-emerald-600 hover:bg-emerald-700"}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="farming">Farming</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          defaultValue="Rajesh"
                          disabled={!isEditing}
                          className="h-11 border-slate-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          defaultValue="Kumar"
                          disabled={!isEditing}
                          className="h-11 border-slate-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            defaultValue="rajesh.kumar@email.com"
                            disabled={!isEditing}
                            className="pl-10 h-11 border-slate-200 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            id="phone"
                            defaultValue="+91 98765 43210"
                            disabled={!isEditing}
                            className="pl-10 h-11 border-slate-200 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          defaultValue="Village Khed, Pune, Maharashtra 412105"
                          disabled={!isEditing}
                          className="h-11 border-slate-200 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="farming" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farmSize">Farm Size (acres)</Label>
                        <Input
                          id="farmSize"
                          defaultValue="25"
                          disabled={!isEditing}
                          className="h-11 border-slate-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farmType">Farm Type</Label>
                        <Input
                          id="farmType"
                          defaultValue="Organic Mixed Farming"
                          disabled={!isEditing}
                          className="h-11 border-slate-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="primaryCrops">Primary Crops</Label>
                        <Input
                          id="primaryCrops"
                          defaultValue="Rice, Wheat, Sugarcane"
                          disabled={!isEditing}
                          className="h-11 border-slate-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience (years)</Label>
                        <Input
                          id="experience"
                          defaultValue="15"
                          disabled={!isEditing}
                          className="h-11 border-slate-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="certifications">Certifications</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className="bg-emerald-100 text-emerald-700">Organic Certified</Badge>
                          <Badge className="bg-blue-100 text-blue-700">Sustainable Farming</Badge>
                          <Badge className="bg-amber-100 text-amber-700">Crop Management</Badge>
                        </div>
                        {isEditing && (
                          <Input
                            placeholder="Add new certification"
                            className="h-11 border-slate-200 focus:border-emerald-500"
                          />
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preferences" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-medium text-slate-800">Language Preferences</Label>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked disabled={!isEditing} className="rounded" />
                            <span className="text-slate-700">English</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked disabled={!isEditing} className="rounded" />
                            <span className="text-slate-700">Hindi</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" disabled={!isEditing} className="rounded" />
                            <span className="text-slate-700">Marathi</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium text-slate-800">Notification Preferences</Label>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked disabled={!isEditing} className="rounded" />
                            <span className="text-slate-700">Weather Alerts</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked disabled={!isEditing} className="rounded" />
                            <span className="text-slate-700">Market Price Updates</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" disabled={!isEditing} className="rounded" />
                            <span className="text-slate-700">Community Messages</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked disabled={!isEditing} className="rounded" />
                            <span className="text-slate-700">Government Scheme Updates</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {isEditing && (
                  <div className="flex justify-end mt-6 pt-6 border-t border-slate-200">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isLoading ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
