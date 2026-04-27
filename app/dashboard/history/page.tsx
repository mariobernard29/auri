import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { HistoryFilter } from "@/components/history-filter"
import { TransactionItem } from "@/components/transaction-item"

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ period?: string, date?: string }> }) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) return null

  // Safely await searchParams (Next.js 15 requires it)
  const params = await searchParams
  const period = params?.period || 'all'
  const specificDate = params?.date

  let dateFilter: any = {}

  // Date Filtering Logic
  if (specificDate) {
    const start = new Date(`${specificDate}T00:00:00.000`)
    const end = new Date(`${specificDate}T23:59:59.999`)
    dateFilter = { gte: start, lte: end }
  } else if (period === 'day') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tonight = new Date()
    tonight.setHours(23, 59, 59, 999)
    dateFilter = { gte: today, lte: tonight }
  } else if (period === 'week') {
    const today = new Date()
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()))
    firstDay.setHours(0, 0, 0, 0)
    const lastDay = new Date(firstDay)
    lastDay.setDate(lastDay.getDate() + 6)
    lastDay.setHours(23, 59, 59, 999)
    dateFilter = { gte: firstDay, lte: lastDay }
  } else if (period === 'month') {
    const date = new Date()
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
    dateFilter = { gte: firstDay, lte: lastDay }
  }

  const transactions = await prisma.transaction.findMany({
    where: { 
      userId,
      ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
    },
    include: { category: true, account: true, subscription: true },
    orderBy: { date: 'desc' },
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Historial de Movimientos 📅</h1>
      
      <HistoryFilter />

      <Card className="shadow-sm overflow-hidden border-border/50">
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-40">
              <p>No se encontraron movimientos para el filtro seleccionado.</p>
            </div>
          ) : (
            <div className="divide-y">
              {transactions.map((t) => (
                <TransactionItem key={t.id} t={t} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
