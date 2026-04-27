import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddTransactionClient } from "@/components/add-transaction-client"

export default async function AddTransactionPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) return null

  let categories = await prisma.category.findMany({ where: { userId } })
  if (categories.length === 0) {
    const defaultCategories = [
      { name: "Comida", type: "expense", userId },
      { name: "Transporte", type: "expense", userId },
      { name: "Entretenimiento", type: "expense", userId },
      { name: "Servicios", type: "expense", userId },
      { name: "Salario", type: "income", userId },
    ]
    await prisma.category.createMany({ data: defaultCategories })
    categories = await prisma.category.findMany({ where: { userId } })
  }

  const accounts = await prisma.financialAccount.findMany({ where: { userId } })
  const subscriptions = await prisma.subscription.findMany({ where: { userId } })

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Agregar Movimiento</h1>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Nuevo Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <AddTransactionClient accounts={accounts} categories={categories} subscriptions={subscriptions} />
        </CardContent>
      </Card>
    </div>
  )
}
