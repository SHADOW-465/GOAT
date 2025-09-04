"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mountain } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const users = {
    "employee@thegoatmedia.com": {
      password: "password",
      role: "employee",
      name: "Alex",
      designation: "Content Strategist",
    },
    "executive@thegoatmedia.com": {
      password: "password",
      role: "executive",
      name: "Morgan",
      designation: "Chief Executive Officer",
    },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = users[email as keyof typeof users]

    if (user && password === user.password) {
      // Store auth state in localStorage
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify({
        name: user.name,
        email: email,
        role: user.role,
        designation: user.designation,
      }))
      
      router.push('/welcome')
    } else {
      setError("Invalid email or password.")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <div className="flex aspect-square size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                    <Mountain className="size-8" />
                </div>
            </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            GOAT Media
          </h1>
          <p className="text-muted-foreground mt-1">Dashboard Login</p>
        </div>
        
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@thegoatmedia.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
            
            <div className="mt-6 p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Use `employee@thegoatmedia.com` or `executive@thegoatmedia.com` with the password `password`.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
