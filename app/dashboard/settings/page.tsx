import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateCategory, deleteCategory, createCategory } from "@/app/actions"
import { Edit2, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AccountSettings } from "@/components/settings-client"

import { ProfileSettings } from "@/components/profile-settings"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { id: userId } })
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Ajustes ⚙️</h1>
      
      <ProfileSettings user={user} />
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Categorías de Movimientos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={createCategory} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">Nueva Categoría</Label>
              <Input id="name" name="name" required placeholder="Ej. Suscripciones" />
            </div>
            <div className="w-32 space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select name="type" defaultValue="expense" required>
                <SelectTrigger className="w-full bg-background mt-[1px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Gasto</SelectItem>
                  <SelectItem value="income">Ingreso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Añadir</Button>
          </form>

          <div className="divide-y rounded-md border">
            {categories.length === 0 ? (
               <p className="p-4 text-center text-sm text-muted-foreground">No tienes categorías creadas.</p>
            ) : categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors">
                <form action={updateCategory} className="flex items-center gap-4 flex-1 mr-4">
                  <input type="hidden" name="id" value={cat.id} />
                  <div className={`w-2 h-2 rounded-full ${cat.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} title={cat.type === 'income' ? 'Ingreso' : 'Gasto'} />
                  <Input name="name" defaultValue={cat.name} required className="h-8 max-w-[200px]" />
                  <Button type="submit" variant="ghost" size="sm" className="h-8 text-muted-foreground">
                    <Edit2 className="h-4 w-4 mr-2" /> Actualizar
                  </Button>
                </form>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AccountSettings />
      </div>
    </div>
  )
}
