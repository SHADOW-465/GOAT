"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Mountain, Quote } from "lucide-react"

const quotes = [
  "Creativity fuels growth.",
  "The secret of getting ahead is getting started.",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
]

export default function WelcomePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; designation: string; role: string } | null>(null)
  const [quote, setQuote] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } else {
      // No user data, redirect to login
      router.push("/login")
    }

    // Select a random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])

    const timer = setTimeout(() => {
      if (userData) {
        const parsedUser = JSON.parse(userData)
        if (parsedUser.role === "employee") {
          router.push("/dashboard/employee")
        } else if (parsedUser.role === "executive") {
          router.push("/dashboard/executive")
        } else {
          router.push("/login")
        }
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-6 overflow-hidden">
      {/* Background Logos */}
      <div className="absolute inset-0 z-0 opacity-5">
        <Mountain className="absolute top-1/4 left-1/4 w-64 h-64 text-foreground/50 transform -translate-x-1/2 -translate-y-1/2" />
        <p className="absolute bottom-1/4 right-1/4 text-8xl font-bold text-foreground/50 transform translate-x-1/2 translate-y-1/2">SNR</p>
      </div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-6">
            <div className="flex aspect-square size-20 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Mountain className="size-12" />
            </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold">
          Good Morning, {user.name}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">({user.designation})</p>

        <motion.div
            className="mt-12 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
        >
            <Quote className="w-6 h-6 text-muted-foreground" />
            <p className="text-xl italic text-muted-foreground">{quote}</p>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 text-center text-muted-foreground">
        <p>Redirecting to your dashboard...</p>
        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
            <motion.div
                className="bg-primary h-1.5 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
            />
        </div>
      </div>
    </div>
  )
}
