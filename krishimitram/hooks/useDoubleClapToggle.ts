"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function useDoubleClapToggle() {
  const { theme, setTheme } = useTheme()
  const clapTimes = useRef<number[]>([])

  useEffect(() => {
    let audioContext: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let rafId: number
    const SAMPLE_RATE = 44100

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const source = audioContext.createMediaStreamSource(stream)

        analyser = audioContext.createAnalyser()
        analyser.fftSize = 2048
        const bufferLength = analyser.frequencyBinCount
        const freqData = new Uint8Array(bufferLength)
        source.connect(analyser)

        const detectClap = () => {
          if (!analyser) return
          analyser.getByteFrequencyData(freqData)

          // Calculate total energy
          const totalEnergy = freqData.reduce((a, b) => a + b, 0)
          const normalizedEnergy = totalEnergy / (bufferLength * 255) // 0-1

          // Calculate frequency spread (number of bins above threshold)
          const BIN_THRESHOLD = 50 // small value
          const spread = freqData.filter((v) => v > BIN_THRESHOLD).length / bufferLength

          // Short-time peak detection (instantaneous)
          const ENERGY_THRESHOLD = 0.22
          const SPREAD_THRESHOLD = 0.4

          if (normalizedEnergy > ENERGY_THRESHOLD && spread > SPREAD_THRESHOLD) {
            const now = Date.now()

            // Ensure claps are spaced apart (debounce)
            if (clapTimes.current.length === 0 || now - clapTimes.current[clapTimes.current.length - 1] > 100) {
              clapTimes.current.push(now)
              if (clapTimes.current.length > 2) clapTimes.current.shift()

              // Double clap window 100–400ms
              if (
                clapTimes.current.length === 2 &&
                clapTimes.current[1] - clapTimes.current[0] >= 100 &&
                clapTimes.current[1] - clapTimes.current[0] <= 400
              ) {
                setTheme(theme === "dark" ? "light" : "dark")
                clapTimes.current = []
              }
            }
          }

          rafId = requestAnimationFrame(detectClap)
        }

        detectClap()
      } catch (err) {
        console.error("Microphone access error:", err)
      }
    }

    init()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (audioContext) audioContext.close()
    }
  }, [theme, setTheme])
}
