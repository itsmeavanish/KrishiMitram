"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, User, AlertTriangle, ClipboardList, FileText } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface Query {
  id: string
  farmerName: string
  crop: string
  question: string
  status: "pending" | "answered"
}

interface Scheme {
  id: string
  title: string
  description: string
  eligibility: string
}

interface Approval {
  id: string
  name: string
  type: "buyer" | "shopowner"
  status: "pending" | "approved" | "rejected"
}

const OfficerDashboard = () => {
  const [queries, setQueries] = useState<Query[]>([])
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [approvals, setApprovals] = useState<Approval[]>([])

  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      gsap.fromTo(statsRef.current?.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1 })
      gsap.fromTo(tabsRef.current?.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2 })
    })
    return () => ctx.revert()
  }, [])

  // Mock data
  useEffect(() => {
    setQueries([
      { id: "1", farmerName: "Ramesh", crop: "Wheat", question: "Best fertilizer for wheat?", status: "pending" },
      { id: "2", farmerName: "Sita", crop: "Rice", question: "When to harvest?", status: "answered" },
    ])
    setSchemes([
      { id: "1", title: "Subsidy for Fertilizers", description: "Get financial support for fertilizers.", eligibility: "All farmers" },
      { id: "2", title: "Crop Insurance", description: "Protect your crops against losses.", eligibility: "Registered farmers" },
    ])
    setApprovals([
      { id: "1", name: "Amit Sharma", type: "buyer", status: "pending" },
      { id: "2", name: "FreshMart", type: "shopowner", status: "approved" },
    ])
  }, [])

  const handleApproval = (id: string, status: "approved" | "rejected") => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-secondary/10">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <motion.div ref={headerRef} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Officer Dashboard</h1>
              <p className="text-xl text-muted-foreground">Manage queries, schemes, and approvals</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Queries</CardTitle>
                <ClipboardList className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{queries.length}</div>
                <p className="text-xs text-muted-foreground">{queries.filter(q => q.status === "pending").length} pending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Government Schemes</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schemes.length}</div>
                <p className="text-xs text-muted-foreground">Available for farmers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Pending Approvals</CardTitle>
                <User className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvals.filter(a => a.status === "pending").length}</div>
                <p className="text-xs text-muted-foreground">Buyers & Shopowners</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>All Approvals</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvals.length}</div>
                <p className="text-xs text-muted-foreground">Total approvals managed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Tabs */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="queries" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="queries">Queries</TabsTrigger>
              <TabsTrigger value="schemes">Schemes</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Queries */}
            <TabsContent value="queries" ref={tabsRef} className="space-y-6">
              <div className="space-y-4">
                {queries.map((q) => (
                  <Card key={q.id} className="p-4">
                    <CardHeader className="flex justify-between items-center">
                      <div>
                        <CardTitle>{q.farmerName} - {q.crop}</CardTitle>
                        <CardDescription>{q.question}</CardDescription>
                      </div>
                      <Badge className={`${
                        q.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}>{q.status}</Badge>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Schemes */}
            <TabsContent value="schemes" className="space-y-6">
              {schemes.map((s) => (
                <Card key={s.id} className="p-4">
                  <CardHeader>
                    <CardTitle>{s.title}</CardTitle>
                    <CardDescription>{s.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Eligibility: {s.eligibility}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Approvals */}
            <TabsContent value="approvals" className="space-y-6">
              {approvals.map((a) => (
                <Card key={a.id} className="p-4 flex justify-between items-center">
                  <div>
                    <CardTitle>{a.name}</CardTitle>
                    <CardDescription>{a.type}</CardDescription>
                  </div>
                  {a.status === "pending" ? (
                    <div className="space-x-2">
                      <Button onClick={() => handleApproval(a.id, "approved")} size="sm" className="bg-green-500 hover:bg-green-600">Approve</Button>
                      <Button onClick={() => handleApproval(a.id, "rejected")} size="sm" className="bg-red-500 hover:bg-red-600">Reject</Button>
                    </div>
                  ) : (
                    <Badge className={a.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{a.status}</Badge>
                  )}
                </Card>
              ))}
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Analytics Placeholder</CardTitle>
                  <CardDescription>Future dashboard charts</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

export default OfficerDashboard
