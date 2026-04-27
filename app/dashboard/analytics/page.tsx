import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { AnalyticsDashboard } from "./charts"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) return null

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'asc' }
  })

  const expenses = transactions.filter((t: any) => t.type === "expense")
  const incomes = transactions.filter((t: any) => t.type === "income")
  
  const expenseCategoryTotals = expenses.reduce((acc: Record<string, number>, curr: any) => {
    const catName = curr.category?.name || "Otros"
    acc[catName] = (acc[catName] || 0) + curr.amount
    return acc
  }, {})

  const incomeCategoryTotals = incomes.reduce((acc: Record<string, number>, curr: any) => {
    const catName = curr.category?.name || "Otros"
    acc[catName] = (acc[catName] || 0) + curr.amount
    return acc
  }, {})

  const expensePieData = Object.keys(expenseCategoryTotals).map(key => ({
    name: key,
    value: expenseCategoryTotals[key]
  }))

  const incomePieData = Object.keys(incomeCategoryTotals).map(key => ({
    name: key,
    value: incomeCategoryTotals[key]
  }))

  // Timeline grouping by month (e.g. "2026-04" -> "Abr 2026")
  const timelineMap: Record<string, { date: string, ingresos: number, gastos: number }> = {}
  
  transactions.forEach(t => {
    const d = new Date(t.date)
    const month = d.toLocaleString('es-ES', { month: 'short' })
    const year = d.getFullYear()
    const key = `${month} ${year}`

    if (!timelineMap[key]) {
      timelineMap[key] = { date: key, ingresos: 0, gastos: 0 }
    }

    if (t.type === 'income') {
      timelineMap[key].ingresos += t.amount
    } else {
      timelineMap[key].gastos += t.amount
    }
  })

  const timelineData = Object.values(timelineMap)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Análisis 📈</h1>
      <AnalyticsDashboard 
        expensePieData={expensePieData} 
        incomePieData={incomePieData} 
        timelineData={timelineData} 
      />
    </div>
  )
}
