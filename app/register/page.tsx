"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      if (res.ok) {
        // Redirige al login después de crear la cuenta exitosamente
        router.push("/login")
      } else {
        const data = await res.json()
        setError(data.message || "Failed to register")
      }
    } catch {
      setError("An unexpected error occurred")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-white px-6">
      
      {/* Top Spacer */}
      <div className="flex-1 w-full flex flex-col items-center justify-center pt-8">
        <Image src="/logo/logo-auri.png" alt="Auri Logo" width={200} height={85} className="mb-4 object-contain" />
        
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground text-center leading-snug mb-8">
          Crea tu cuenta de AURI.<br/>
          <span className="text-muted-foreground font-medium text-lg">Comienza en segundos.</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <div className="space-y-1.5">
            <input
              id="name"
              placeholder="Tu nombre (ej. Juan)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex w-full h-14 rounded-2xl bg-secondary/40 border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-base px-4 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <input
              id="email"
              type="email"
              placeholder="Correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex w-full h-14 rounded-2xl bg-secondary/40 border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-base px-4 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex w-full h-14 rounded-2xl bg-secondary/40 border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-base px-4 transition-colors"
            />
          </div>
          
           <div className="h-4">
             {error && <p className="text-sm text-destructive font-medium text-center animate-in fade-in zoom-in-95">{error}</p>}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button type="submit" className="w-full h-14 text-lg font-medium rounded-2xl bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 transition-opacity">
              Registrarse
            </button>
            
            <button type="button" className="w-full h-14 text-lg font-medium rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors" onClick={() => router.push('/login')}>
              Volver al inicio
            </button>
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
