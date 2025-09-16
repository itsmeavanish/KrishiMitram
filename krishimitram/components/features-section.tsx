"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ShoppingCart, Brain, BookOpen, Users, TrendingUp, ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Cards stagger animation
      gsap.fromTo(
        cardsRef.current?.children,
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: FileText,
      title: "Government Schemes",
      description: "Access and apply for agricultural schemes with real-time updates and eligibility checks.",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: ShoppingCart,
      title: "Marketplace",
      description: "Buy, sell, and rent farming equipment. Connect with buyers and sellers in your district.",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: Brain,
      title: "AI Advisory",
      description: "Get personalized farming advice based on weather, soil conditions, and crop history.",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      icon: BookOpen,
      title: "Tutorials",
      description: "Learn modern farming techniques through video tutorials and comprehensive guides.",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with fellow farmers, share experiences, and participate in local events.",
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950/20",
    },
    {
      icon: TrendingUp,
      title: "Activity Tracking",
      description: "Monitor your farming activities, track progress, and analyze growth patterns.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    },
  ]

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-balance mb-6 text-foreground">
            Everything You Need to
            <span className="block text-primary">Grow Your Farm</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
            Comprehensive tools and resources designed specifically for modern farmers to increase productivity, reduce
            costs, and build sustainable farming practices.
          </p>
        </motion.div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div key={index} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3, ease: "easeOut" }}>
              <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 group/btn">
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
