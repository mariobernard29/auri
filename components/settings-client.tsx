"use client"

import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Moon, Sun } from "lucide-react"

export function ThemeSettings() {
  const { setTheme } = useTheme()

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Apariencia</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Button variant="outline" className="flex-1 h-12" onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-5 w-5" /> Claro
        </Button>
        <Button variant="outline" className="flex-1 h-12" onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-5 w-5" /> Oscuro
        </Button>
      </CardContent>
    </Card>
  )
}

export function AccountSettings() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" className="w-full h-12 text-md" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="mr-2 h-5 w-5" /> Cerrar Sesión
        </Button>
      </CardContent>
    </Card>
  )
}
