import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditAccountCard } from "@/components/edit-account-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createAccount } from "@/app/actions"

export default async function AccountsPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) return null

  const accounts = await prisma.financialAccount.findMany({
    where: { userId }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Mis Cuentas 💳</h1>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Añadir Nueva Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAccount} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2 w-full">
              <Label htmlFor="name">Nombre de la cuenta</Label>
              <Input id="name" name="name" required placeholder="Ej. Tarjeta de Crédito Nu" />
            </div>
            <div className="w-full sm:w-40 space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select 
                  name="type" 
                  defaultValue="cash"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="cash">Efectivo</option>
                  <option value="bank">Banco</option>
                  <option value="credit">Crédito</option>
              </select>
            </div>
            <div className="w-full sm:w-32 space-y-2">
              <Label htmlFor="balance">Balance Inicial</Label>
              <Input id="balance" name="balance" type="number" step="0.01" defaultValue="0" required />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Crear Cuenta</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
        {accounts.map(account => (
          <EditAccountCard key={account.id} account={{ id: account.id, name: account.name, type: account.type, balance: account.balance }} />
        ))}
      </div>
    </div>
  )
}
