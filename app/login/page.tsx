"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      
      if (res?.error) {
        setError(res.error)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("Ocurrió un error de red o interno")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-white px-6">
      
      {/* Top Spacer */}
      <div className="flex-1 w-full flex flex-col items-center justify-center pt-10">
        <Image src="/logo/logo-auri.png" alt="Auri Logo" width={220} height={94} className="mb-6 object-contain" />
        
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground text-center leading-snug mb-10">
          Controla tus gastos.<br/>
          <span className="text-muted-foreground font-medium text-lg">Toma el control.</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="space-y-1.5">
            <Input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 rounded-2xl bg-secondary/40 border-transparent focus:border-primary/50 text-base px-4"
            />
          </div>
          <div className="space-y-1.5">
            <Input
              id="password"
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 rounded-2xl bg-secondary/40 border-transparent focus:border-primary/50 text-base px-4"
            />
          </div>
          
          <div className="h-4">
             {error && <p className="text-sm text-destructive font-medium text-center animate-in fade-in zoom-in-95">{error}</p>}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button type="submit" className="w-full h-14 text-lg font-medium rounded-2xl shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </Button>
            
            <Button type="button" variant="secondary" className="w-full h-14 text-lg font-medium rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground" onClick={() => router.push('/register')}>
              Crear cuenta
            </Button>
          </div>
        </form>
      </div>

      {/* Decorative Wave at the bottom matching the brand manual */}
      <div className="w-full fixed bottom-0 left-0 right-0 -z-10 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-auto drop-shadow-sm">
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5B4BFF" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          <path fill="url(#wave-gradient)" fillOpacity="1" d="M0,192L60,197.3C120,203,240,213,360,192C480,171,600,117,720,117.3C840,117,960,171,1080,186.7C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

    </div>
  )
}
