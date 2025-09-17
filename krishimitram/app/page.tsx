"use client"

import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import { useDoubleClapToggle } from "@/hooks/useDoubleClapToggle"

export default function HomePage() {
  useDoubleClapToggle()

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
