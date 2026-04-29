"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, PieChart, PlusCircle, CreditCard, Settings, List, PlaySquare, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const desktopNavItems = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Historial", href: "/dashboard/history", icon: List },
  { name: "Análisis", href: "/dashboard/analytics", icon: PieChart },
  { name: "Cuentas", href: "/dashboard/accounts", icon: CreditCard },
  { name: "Suscripciones", href: "/dashboard/subscriptions", icon: PlaySquare },
  { name: "Ajustes", href: "/dashboard/settings", icon: Settings },
]

const mobileNavItems = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Historial", href: "/dashboard/history", icon: List },
  { name: "Análisis", href: "/dashboard/analytics", icon: PieChart },
  { name: "Cuentas", href: "/dashboard/accounts", icon: CreditCard },
  { name: "Más", href: "/dashboard/more", icon: MoreHorizontal },
]

const mainAction = { name: "Agregar", href: "/dashboard/add", icon: PlusCircle }

export function Navigation({ user }: { user?: { name: string | null, email: string | null, image: string | null } | null }) {
  const pathname = usePathname()
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U"

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 md:hidden">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.name === 'Más' && (pathname === '/dashboard/subscriptions' || pathname === '/dashboard/settings'))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-14 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>

      <Link
        key={mainAction.name}
        href={mainAction.href}
        className="fixed bottom-20 right-4 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform active:scale-95 md:hidden"
      >
        <mainAction.icon className="h-7 w-7" />
      </Link>

      <div className="hidden h-screen w-64 flex-col border-r bg-card md:flex fixed left-0 top-0">
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/dashboard" className="flex items-center hover:opacity-90 transition-opacity">
            <Image src="/logo/logo-auri.png" alt="Auri Logo" width={110} height={46} className="object-contain" />
          </Link>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-6">
          {desktopNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-xl px-3 py-2.5 transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
          
          <div className="pt-6">
            <Link
              href={mainAction.href}
              className="flex items-center justify-center space-x-2 rounded-xl bg-primary text-primary-foreground px-3 py-3 transition-transform hover:opacity-90 active:scale-95 shadow-md shadow-primary/30"
            >
              <mainAction.icon className="h-5 w-5" />
              <span className="font-medium">{mainAction.name}</span>
            </Link>
          </div>
        </nav>

        {/* User Profile Section */}
        {user && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted/50 transition-colors cursor-default">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold overflow-hidden border">
                {user.image ? (
                  <Image src={user.image} alt={user.name || "User"} width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  initial
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
