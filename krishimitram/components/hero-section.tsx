"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sprout, Users, TrendingUp } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation
      gsap.fromTo(
        titleRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.3,
        },
      )

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          delay: 0.6,
        },
      )

      // CTA buttons animation
      gsap.fromTo(
        ctaRef.current?.children,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.9,
          stagger: 0.2,
        },
      )

      // Stats animation
      gsap.fromTo(
        statsRef.current?.children,
        {
          y: 40,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 1.2,
          stagger: 0.15,
        },
      )

      // Parallax effect for background elements
      gsap.to(".floating-element", {
        y: -50,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const stats = [
    { icon: Users, value: "50K+", label: "Active Farmers" },
    { icon: Sprout, value: "200+", label: "Crop Varieties" },
    { icon: TrendingUp, value: "85%", label: "Success Rate" },
  ]

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-card/30 to-secondary/20"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-secondary/15 rounded-full blur-2xl"></div>
        <div className="floating-element absolute bottom-20 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-40 right-1/3 w-16 h-16 bg-primary/15 rounded-full blur-lg"></div>
      </div>

      {/* Hero image placeholder */}
      <div className="absolute inset-0 z-0">
        <img
          src="/beautiful-green-farm-landscape-with-crops-and-farm.jpg"
          alt="Farming landscape"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <motion.h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent"
          >
            Empowering Farmers with
            <span className="block text-primary">Digital Innovation</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Your comprehensive digital companion for modern farming. Access government schemes, AI-powered advisory,
            marketplace, and connect with a thriving farming community.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg group"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <stat.icon className="h-8 w-8 text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
