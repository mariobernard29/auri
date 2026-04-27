import Link from "next/link"
import { Settings, PlaySquare, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function MorePage() {
  return (
    <div className="space-y-6 max-w-md mx-auto min-h-[70vh]">
      <h1 className="text-3xl font-bold tracking-tight px-2">Más Opciones</h1>
      
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/subscriptions" className="group">
          <Card className="hover:border-primary/50 transition-colors border-border/50">
            <CardContent className="flex items-center gap-4 p-4 text-left">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                <PlaySquare className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Suscripciones</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Administra Netflix, Spotify, y más.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/settings" className="group">
          <Card className="hover:border-primary/50 transition-colors border-border/50">
            <CardContent className="flex items-center gap-4 p-4 text-left">
              <div className="p-3 bg-slate-500/10 text-slate-500 rounded-xl dark:text-slate-400">
                <Settings className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Ajustes Generales</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Configura categorías y tu cuenta.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
